# Plan 010: Fix the February crash — make `getDailyDateToday` use the project's month spelling

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 5caeab0..HEAD -- apps/daily/src/lib/utils.ts apps/daily/src/lib/like.ts`
> Then compare the "Current state" excerpts below against the live files. On a
> mismatch (the excerpt isn't there), treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/009-daily-test-runner.md (for the regression test in Step 2)
- **Category**: bug
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

`getDailyDateToday()` derives the month name from
`today.toLocaleString("en-US", { month: "long" }).toLowerCase()`, which for
February returns the correct English spelling **`"february"`**. But the entire
rest of the app uses a **misspelled** `"febuary"` — the content directory
(`src/content/febuary/`), the `monthSchema` enum, and `monthSubjectsMap` all
agree on the misspelling. So every day in February:

- The home page `/` (`src/app/page.tsx`) calls `getDaily({ month: "february", … })`,
  which does `import('@/content/february/<day>.mdx')` — a path that **does not
  exist** → an unhandled module-not-found error → the home page crashes.
- The root OpenGraph image (`src/app/opengraph-image.tsx`) crashes the same way.

This is latent right now (audited in June) but **breaks every February**, and the
git history (`Fix Febuary data not showing`) shows this class of bug has bitten
before. A prior audit logged this as finding **F8** but concluded "the app works
(all three agree)" — it overlooked that this *runtime-produced* value disagrees
with the three static spellings.

**The fix deliberately does not rename anything.** Renaming the `febuary`
directory to the correct spelling would orphan users' saved likes (localStorage
keys are `__daily_/febuary/<day>`) and break shared URLs (`/febuary/14`). Instead
we make `getDailyDateToday` derive the month **by index from the canonical
`monthSchema.options`** — exactly how `getMonthToday()` in `DailyCalendar.tsx`
already does it — so the produced value matches the misspelled scheme with zero
migration.

## Current state

- `src/lib/utils.ts:1-6` imports (note: `TZDate` from `@date-fns/tz`, and a
  **type-only** import of `DailyDate` from `./like`):
  ```ts
  import { TZDate } from "@date-fns/tz";
  import clsx, { type ClassValue } from "clsx";
  import { remark } from "remark";
  import strip from "strip-markdown";
  import { twMerge } from "tailwind-merge";
  import type { DailyDate } from "./like";
  ```
- `src/lib/utils.ts:41-47` — the function to fix:
  ```ts
  export function getDailyDateToday(): DailyDate {
    const today = new TZDate(new Date(), "Asia/Manila");
    const month = today.toLocaleString("en-US", { month: "long" }).toLowerCase();
    const day = today.getDate().toString();

    return { day, month };
  }
  ```
- `src/lib/like.ts:36-49` — the canonical month list (index 1 is `"febuary"`):
  ```ts
  export const monthSchema = z.enum([
    "january", "febuary", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ]);
  ```
  `monthSchema.options` is this array, ordered to match JS `Date.getMonth()` (0–11).
- `src/components/DailyCalendar.tsx:40-42` — the index-based pattern to mirror:
  ```ts
  export function getMonthToday() {
    return Months[new Date().getMonth()]; // Months = monthSchema.options
  }
  ```
- Callers of `getDailyDateToday` (all expect the directory spelling, i.e. the
  misspelled form): `src/app/page.tsx:11` and `:34`,
  `src/app/opengraph-image.tsx:22`, `src/app/hello/page.tsx:9` (hello only renders
  the string; it benefits but isn't the bug site — and is deleted by plan 013).
- `src/lib/like.ts` imports **only** `zod/mini` (no import from `./utils`), so
  adding a value import of `monthSchema` into `utils.ts` does **not** create a cycle.

Convention to follow: derive month index from `monthSchema.options` (single
source of truth), preserve the `Asia/Manila` timezone for the day rollover.

## Commands you will need

| Purpose      | Command                          | Expected on success    |
|--------------|----------------------------------|------------------------|
| Typecheck    | `pnpm --filter daily typecheck`  | exit 0                 |
| Test         | `pnpm --filter daily test`       | exit 0, all pass       |
| Lint         | `pnpm --filter daily lint`       | exit 0                 |
| Grep check   | `grep -n "toLocaleString" apps/daily/src/lib/utils.ts` | no matches |

## Scope

**In scope** (the only files you may modify):
- `apps/daily/src/lib/utils.ts`
- `apps/daily/src/lib/utils.test.ts` (add a case — created by plan 009)

**Out of scope** (do NOT touch):
- `src/lib/like.ts` and `monthSchema` — the misspelling is intentional and
  load-bearing (localStorage keys, URLs, the content directory all use it).
- The `src/content/febuary/` directory — do **not** rename it.
- `getMonthToday` in `DailyCalendar.tsx` — already correct.

## Git workflow

- Branch: `advisor/010-daily-february-today-fix` (or the repo's convention).
- Commit style: conventional commits (e.g. `fix(daily): derive today's month by index, not locale`).
- Do NOT push or open a PR unless the operator asked.

## Steps

### Step 1: Derive the month by index instead of by locale string

In `src/lib/utils.ts`, change the **type-only** `./like` import to also import
the `monthSchema` value, and rewrite `getDailyDateToday`:

Change the import line `import type { DailyDate } from "./like";` to:
```ts
import { type DailyDate, monthSchema } from "./like";
```
Rewrite the function to:
```ts
export function getDailyDateToday(): DailyDate {
  const today = new TZDate(new Date(), "Asia/Manila");
  const month = monthSchema.options[today.getMonth()];
  const day = today.getDate().toString();

  return { day, month };
}
```

**Verify**:
- `pnpm --filter daily typecheck` → exit 0
- `grep -n "toLocaleString" apps/daily/src/lib/utils.ts` → no matches

### Step 2: Add the February regression test

In `apps/daily/src/lib/utils.test.ts` (created in plan 009), add cases inside the
existing `describe("getDailyDateToday", …)` block:
```ts
  it("uses the project's 'febuary' spelling in February (regression)", () => {
    // 2026-02-15 14:00 Manila (UTC+8) => Feb 15
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-15T06:00:00.000Z"));
    expect(getDailyDateToday()).toEqual({ month: "febuary", day: "15" });
  });

  it("returns december for a December date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-12-25T06:00:00.000Z"));
    expect(getDailyDateToday()).toEqual({ month: "december", day: "25" });
  });
```

**Verify**: `pnpm --filter daily test` → exit 0; the new February test passes
(it would have failed before Step 1, returning `month: "february"`).

## Test plan

- New cases in `apps/daily/src/lib/utils.test.ts`:
  - February returns `{ month: "febuary", … }` (the exact regression).
  - December sanity case (guards the index mapping for a late month).
- Model after the existing `getDailyDateToday` June test that plan 009 created.
- Verification: `pnpm --filter daily test` → all pass, including the 2 new cases.

## Done criteria

ALL must hold:
- [ ] `pnpm --filter daily typecheck` exits 0
- [ ] `pnpm --filter daily lint` exits 0
- [ ] `pnpm --filter daily test` exits 0; the February regression test passes
- [ ] `grep -n "toLocaleString" apps/daily/src/lib/utils.ts` returns no matches
- [ ] `git status` shows only `utils.ts` and `utils.test.ts` changed
- [ ] `plans/README.md` status row for 010 updated

## STOP conditions

Stop and report back (do not improvise) if:
- `monthSchema.options[1]` is **not** `"febuary"` (the enum order changed since
  this plan was written) — the index mapping would be wrong.
- Adding the value import of `monthSchema` into `utils.ts` triggers a circular
  import / runtime error. Escape hatch: if and only if a cycle appears, instead
  inline a local `const MONTHS = ["january","febuary",…,"december"] as const;`
  in `utils.ts` and index into that. Report that you used the fallback.
- The dependency (plan 009) test runner is not present — `pnpm --filter daily test`
  errors with "unknown command" or there is no `utils.test.ts`. Do 009 first.
- A different month's existing test starts failing after Step 1.

## Maintenance notes

- This keeps the misspelled `"febuary"` scheme intact on purpose. If the project
  ever decides to correct the spelling everywhere, that is a separate, larger
  change: rename `src/content/febuary/`, update `monthSchema` + `monthSubjectsMap`,
  AND add a localStorage key-migration shim (`__daily_/febuary/*` → new) plus a
  URL redirect. That was finding F8 and is deliberately out of scope here.
- Reviewer should confirm the home page renders in February (set the system clock
  to a February date, or trust the regression test) and that `/febuary/<day>` URLs
  still resolve.
