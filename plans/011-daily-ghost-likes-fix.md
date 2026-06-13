# Plan 011: Stop unliked entries appearing in the "Liked" list; remove dead like helpers

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 5caeab0..HEAD -- apps/daily/src/lib/like.ts apps/daily/src/hooks/useLocalStorage.ts apps/daily/src/hooks/useLikes.ts`
> Then compare the "Current state" excerpts below against the live files. On a
> mismatch (the excerpt isn't there), treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/009-daily-test-runner.md (for the regression test in Step 3)
- **Category**: bug (+ tech-debt cleanup)
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

The "Liked" list shows entries the user has **unliked**. Two mechanisms collide:

1. Liking/unliking goes through `useLocalStorage` (via
   `useLikedContext`→`useIsLiked`). Its `setValue` **always writes the key** —
   on unlike it stores `JSON.stringify(false)` (the string `"false"`) and
   **never deletes** the key.
2. The "Liked" list (`useLikes` → `getAllLikedDates`) selects liked dates by
   matching the localStorage **key prefix only** — it ignores the stored value.

So once a user likes then unlikes an entry, a key like `__daily_/march/5` with
value `"false"` remains, and `getAllLikedDates` still returns it → the unliked
entry keeps showing under "Liked."

The fix: `getAllLikedDates` must keep only keys whose stored value parses to
`true`. While here, delete the unused `like()` / `removeLike()` / `getIsLiked()`
helpers — they are a second, divergent like-API with **zero callers** (verified)
that confuses this exact area of the code.

## Current state

- `src/lib/like.ts:66-82` — the dead helpers (top three) and the buggy selector:
  ```ts
  export function like(daily: DailyDate) {
    return localStorage.setItem(toKey(daily), JSON.stringify(true));
  }
  export function removeLike(daily: DailyDate) {
    return localStorage.removeItem(toKey(daily));
  }
  export function getIsLiked(daily: DailyDate) {
    return Boolean(localStorage.getItem(toKey(daily)));
  }
  export function getAllLikedDates(month?: Month): DailyDate[] {
    const monthsToCheck = month ? [month] : monthSchema.options;
    return Object.keys(localStorage)
      .filter((key) =>
        monthsToCheck.some((_month) => key.startsWith(`${DAILY_KEY}${_month}`))
      )
      .map(parseKey);
  }
  ```
- `src/lib/like.ts:16-19` — the key helpers used above:
  ```ts
  const DAILY_KEY = "__daily_/";
  export function toKey({ day, month }: DailyDate) {
    return `${DAILY_KEY}${month}/${day}`;
  }
  ```
- `src/hooks/useLocalStorage.ts:18-22` — why a `"false"` value sticks around
  (this hook is **out of scope** to change here):
  ```ts
  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore)); // never removes
  };
  ```
- `src/hooks/useLikes.ts:10` — the only caller of `getAllLikedDates`:
  ```ts
  const likedDates = getAllLikedDates(month);
  ```
- Verified: `grep -rn "getIsLiked\|removeLike" apps/daily/src` returns only the
  definitions in `like.ts`; `like(` has no call sites. All three are dead.

## Commands you will need

| Purpose      | Command                          | Expected on success    |
|--------------|----------------------------------|------------------------|
| Typecheck    | `pnpm --filter daily typecheck`  | exit 0                 |
| Test         | `pnpm --filter daily test`       | exit 0, all pass       |
| Lint         | `pnpm --filter daily lint`       | exit 0                 |
| Dead-code grep | `grep -rn "getIsLiked\|removeLike\|function like(" apps/daily/src` | no matches after Step 2 |

## Scope

**In scope** (the only files you may modify):
- `apps/daily/src/lib/like.ts`
- `apps/daily/src/lib/like.test.ts` (add cases — created by plan 009)

**Out of scope** (do NOT touch):
- `src/hooks/useLocalStorage.ts` — the value-filter in `getAllLikedDates` fully
  fixes the symptom. Making the generic hook delete keys on `false` is a separate,
  optional follow-up (see Maintenance notes); changing it here widens blast radius.
- `src/hooks/useLikes.ts`, `src/components/Likes.tsx` — unchanged.

## Git workflow

- Branch: `advisor/011-daily-ghost-likes-fix` (or the repo's convention).
- Commit style: conventional commits (e.g. `fix(daily): exclude unliked entries from liked list`).
- Do NOT push or open a PR unless the operator asked.

## Steps

### Step 1: Filter `getAllLikedDates` by stored value

Replace `getAllLikedDates` in `src/lib/like.ts` with:
```ts
export function getAllLikedDates(month?: Month): DailyDate[] {
  const monthsToCheck = month ? [month] : monthSchema.options;
  return Object.keys(localStorage)
    .filter((key) =>
      monthsToCheck.some((_month) => key.startsWith(`${DAILY_KEY}${_month}`))
    )
    .filter((key) => {
      try {
        return JSON.parse(localStorage.getItem(key) ?? "false") === true;
      } catch {
        return false;
      }
    })
    .map(parseKey);
}
```

**Verify**: `pnpm --filter daily typecheck` → exit 0.

### Step 2: Delete the dead like helpers

Remove the `like`, `removeLike`, and `getIsLiked` exports (the three functions at
`like.ts:66-74`). Leave `toKey`, `parseKey`, `getAllLikedDates`,
`monthSubjectsMap`, `monthSchema`, `isValidMonth`, and the types untouched.

**Verify**:
- `grep -rn "getIsLiked\|removeLike\|function like(" apps/daily/src` → no matches
- `pnpm --filter daily typecheck` → exit 0 (nothing imported them)
- `pnpm --filter daily lint` → exit 0

### Step 3: Regression test for the value filter

Add to `apps/daily/src/lib/like.test.ts` (created in plan 009). The test stubs a
minimal in-memory `localStorage` (vitest's node env has none):
```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAllLikedDates } from "./like";

function makeLocalStorage(seed: Record<string, string>) {
  const store = new Map(Object.entries(seed));
  return {
    get length() {
      return store.size;
    },
    key: (i: number) => [...store.keys()][i] ?? null,
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
  } as Storage;
}

describe("getAllLikedDates", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("includes liked keys and excludes unliked, malformed, and foreign keys", () => {
    vi.stubGlobal(
      "localStorage",
      makeLocalStorage({
        "__daily_/march/5": "true", // liked  -> included
        "__daily_/march/6": "false", // unliked -> excluded (the bug)
        "__daily_/april/1": "notjson", // malformed -> excluded
        unrelated_key: "true", // foreign -> excluded
      })
    );

    const dates = getAllLikedDates();
    expect(dates).toEqual([{ month: "march", day: "5" }]);
  });

  it("honors the month filter", () => {
    vi.stubGlobal(
      "localStorage",
      makeLocalStorage({
        "__daily_/march/5": "true",
        "__daily_/april/1": "true",
      })
    );
    expect(getAllLikedDates("april")).toEqual([{ month: "april", day: "1" }]);
  });
});
```

**Verify**: `pnpm --filter daily test` → exit 0; the "excludes unliked" test
passes (it would have failed before Step 1 — the `"false"` key would be returned).

## Test plan

- New cases in `apps/daily/src/lib/like.test.ts`:
  - liked (`"true"`) included; unliked (`"false"`) excluded — the exact bug.
  - malformed JSON value excluded (the `try/catch` guard).
  - foreign (non-`__daily_`) key ignored.
  - month filter narrows results.
- Model after the `toKey`/`parseKey` tests in the same file (plan 009).
- Verification: `pnpm --filter daily test` → all pass.

## Done criteria

ALL must hold:
- [ ] `pnpm --filter daily typecheck` exits 0
- [ ] `pnpm --filter daily lint` exits 0
- [ ] `pnpm --filter daily test` exits 0; the unliked-exclusion test passes
- [ ] `grep -rn "getIsLiked\|removeLike\|function like(" apps/daily/src` → no matches
- [ ] `git status` shows only `like.ts` and `like.test.ts` changed
- [ ] `plans/README.md` status row for 011 updated

## STOP conditions

Stop and report back (do not improvise) if:
- The drift-check grep finds **any** caller of `like`, `removeLike`, or
  `getIsLiked` outside `like.ts` (something started using them since this plan
  was written) — deleting them would then break a caller.
- You conclude the value-filter alone does **not** fix the symptom (e.g. you
  discover `setValue` writes something other than `"true"`/`"false"`). Report
  before touching `useLocalStorage` — that's out of scope.
- The dependency (plan 009) test runner is not present.

## Maintenance notes

- **Optional follow-up (deferred):** `useLocalStorage.setValue` could `removeItem`
  when the value is falsy, so localStorage stops accumulating `"false"` entries.
  Left out here to keep the generic hook unchanged; the `getAllLikedDates` filter
  is the authoritative fix and is robust even if stale `"false"` keys exist.
- If a real like-persistence layer (accounts/backend) is ever added, the
  key-prefix-scan in `getAllLikedDates` is the integration point to revisit.
- Reviewer: confirm that liking then unliking an entry removes it from the "Liked"
  section on the month page.
