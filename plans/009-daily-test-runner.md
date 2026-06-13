# Plan 009: Add a Vitest runner + characterization tests for daily's pure logic

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 5caeab0..HEAD -- apps/daily/package.json turbo.json package.json .github/workflows/ci.yml`
> The working tree already contains applied plans 001–006 (uncommitted) — that
> is expected, not drift. What matters: compare the "Current state" excerpts
> below against the live files before proceeding. On a real mismatch (the
> excerpt isn't there), treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (plan 001 already added the `typecheck` task + CI; this extends it per 001's own maintenance note)
- **Category**: tests
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

`apps/daily` has **zero tests** and no test runner. Its most bug-prone code is
pure logic: the date-of-today helper and the localStorage like-key helpers.
The git history is full of "Fix `<Month>` data not showing" commits, and two
live bugs sit in exactly this untested code (fixed by plans 010 and 011). Plan
001 added a `typecheck`/build gate and CI but explicitly did **not** add a test
runner — its maintenance note says "when tests are added later, append a `test`
task to Turbo and a `pnpm test` line to `ci.yml`." This plan does that, and adds
characterization tests that pin the **currently-correct** behavior of the pure
helpers. It unblocks plans 010 and 011, which add red→green regression tests on
top of this infrastructure.

This plan adds **no source-logic changes** — only the runner, config, and tests.

## Current state

- `apps/daily/package.json` scripts (no `test`):
  ```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "biome check",
    "format": "biome format --write"
  }
  ```
  `devDependencies` already include `typescript` (catalog), `@types/node` `^22`,
  Biome, Tailwind, `babel-plugin-react-compiler`. There is **no** `vitest`.
- There is **no** `vitest.config.ts` in `apps/daily`, and **no** `*.test.ts`
  file anywhere in the repo.
- `turbo.json` (root) currently:
  ```json
  {
    "$schema": "https://turborepo.org/schema.json",
    "ui": "tui",
    "tasks": {
      "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
      "typecheck": { "dependsOn": ["^typecheck"], "outputs": [] },
      "lint": { "outputs": [] },
      "format": {},
      "dev": { "cache": false, "persistent": true }
    }
  }
  ```
- Root `package.json` scripts include `"typecheck": "turbo run typecheck"` (added
  by plan 001) but **no** `"test"`.
- `.github/workflows/ci.yml` (created by plan 001) runs, in order:
  `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm typecheck` → `pnpm build`.
- The pure functions this plan will test (read them to confirm the excerpts):
  - `src/lib/like.ts:16-19` `toKey` and `:57-64` `parseKey` (key `__daily_/<month>/<day>`).
  - `src/lib/like.ts:36-53` `monthSchema` (12 options, **`"febuary"`** at index 1) + `isValidMonth`.
  - `src/lib/utils.ts:41-51` `getDailyDateToday` (uses `TZDate` "Asia/Manila") + `capitalize`.

Repo conventions: pnpm workspace + catalog (`pnpm-workspace.yaml`), Biome
(ultracite preset), Turbo. Node 24, pnpm 11.5.0. The catalog has **no** vitest
entry, so vitest is added as a direct version range (not `catalog:`).

## Commands you will need

| Purpose         | Command                              | Expected on success           |
|-----------------|--------------------------------------|-------------------------------|
| Install         | `pnpm install`                       | exit 0                        |
| Test (daily)    | `pnpm --filter daily test`           | exit 0, all tests pass        |
| Test (root)     | `pnpm test`                          | exit 0, runs daily's tests    |
| Typecheck       | `pnpm --filter daily typecheck`      | exit 0                        |
| Lint            | `pnpm --filter daily lint`           | exit 0                        |

(`daily` is the package `name` in `apps/daily/package.json`.)

## Scope

**In scope** (the only files you may modify/create):
- `apps/daily/package.json` (add `vitest` devDep + `test`/`test:watch` scripts)
- `apps/daily/vitest.config.ts` (create)
- `apps/daily/src/lib/like.test.ts` (create)
- `apps/daily/src/lib/utils.test.ts` (create)
- `turbo.json` (add `test` task)
- `package.json` (root — add `test` script)
- `.github/workflows/ci.yml` (add a `pnpm test` step)

**Out of scope** (do NOT touch):
- Any source `.ts`/`.tsx` **logic**. Do **not** fix bugs here — in particular do
  **not** edit `getDailyDateToday` (plan 010) or `getAllLikedDates` (plan 011).
  The tests you write here must describe behavior **as it is today**.
- `biome.json`, any `tsconfig.json`, the pnpm catalog/workspace file.

## Steps

### Step 1: Add vitest and the test scripts

In `apps/daily/package.json`, add to `devDependencies`:
```json
"vitest": "^3.2.0"
```
and add to `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest"
```
Then run `pnpm install`.

**Verify**: `pnpm install` → exit 0; `pnpm --filter daily exec vitest --version` prints a 3.x version.

### Step 2: Create the vitest config

Create `apps/daily/vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```
(The test files sit next to the modules they test and use **relative** imports,
so no `@/` path-alias resolution is required.)

**Verify**: `pnpm --filter daily test` → exit 0 with "No test files found" (no
tests exist yet) — this confirms vitest runs.

### Step 3: Characterization tests for the like-key helpers

Create `apps/daily/src/lib/like.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { isValidMonth, monthSchema, parseKey, toKey } from "./like";

describe("month schema", () => {
  it("has 12 months with the project's 'febuary' spelling at index 1", () => {
    expect(monthSchema.options).toHaveLength(12);
    expect(monthSchema.options[0]).toBe("january");
    expect(monthSchema.options[1]).toBe("febuary"); // intentional project spelling
    expect(monthSchema.options[11]).toBe("december");
  });

  it("validates membership", () => {
    expect(isValidMonth("febuary")).toBe(true);
    expect(isValidMonth("february")).toBe(false); // the misspelling is canonical here
    expect(isValidMonth("nope")).toBe(false);
  });
});

describe("toKey / parseKey", () => {
  it("round-trips a date through the storage key", () => {
    const key = toKey({ month: "march", day: "5" });
    expect(key).toBe("__daily_/march/5");
    expect(parseKey(key)).toEqual({ month: "march", day: "5" });
  });
});
```

**Verify**: `pnpm --filter daily test` → exit 0, 3 tests pass.

### Step 4: Characterization test for the date helpers (non-February only)

Create `apps/daily/src/lib/utils.test.ts`:
```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { capitalize, getDailyDateToday } from "./utils";

afterEach(() => {
  vi.useRealTimers();
});

describe("capitalize", () => {
  it("uppercases the first character", () => {
    expect(capitalize("march")).toBe("March");
  });
});

describe("getDailyDateToday", () => {
  it("returns the project month name + day for a normal month (Manila tz)", () => {
    // 2026-06-13 14:00 Manila (UTC+8) => June 13
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-13T06:00:00.000Z"));
    expect(getDailyDateToday()).toEqual({ month: "june", day: "13" });
  });
});
```

> Do **not** add a February case here — that is plan 010's red→green
> regression test (it would fail against today's code).

**Verify**: `pnpm --filter daily test` → exit 0, all tests pass (5 total).

### Step 5: Wire the Turbo task, root script, and CI

In `turbo.json`, add inside `tasks` (e.g. after `typecheck`):
```json
"test": { "outputs": [] }
```
In root `package.json` `scripts`, add:
```json
"test": "turbo run test"
```
In `.github/workflows/ci.yml`, add a `pnpm test` step **after** the
`pnpm typecheck` step and before `pnpm build`:
```yaml
      - run: pnpm test
```

**Verify**: `pnpm test` (from repo root) → exit 0; Turbo runs `test` for `daily`
(other packages have no `test` script and are skipped).

## Test plan

The tests are the deliverable. Cases covered:
- `monthSchema` shape + the intentional `"febuary"` spelling (guards plan 010's
  premise and prevents an accidental "fix" that reorders the enum).
- `isValidMonth` true/false including the misspelling-is-canonical case.
- `toKey`/`parseKey` round-trip (guards the localStorage key format plan 011 relies on).
- `capitalize` happy path.
- `getDailyDateToday` for a normal month with a fixed clock (Manila tz preserved).

No existing test to model after (this is the first). Use the standard vitest
`describe`/`it`/`expect` style shown above.

## Done criteria

ALL must hold:
- [ ] `pnpm --filter daily test` exits 0 and reports 5 passing tests
- [ ] `pnpm test` (root) exits 0 and runs daily's tests via Turbo
- [ ] `pnpm --filter daily typecheck` exits 0 (test files typecheck too)
- [ ] `pnpm --filter daily lint` exits 0
- [ ] `.github/workflows/ci.yml` contains a `pnpm test` step between typecheck and build
- [ ] `git status` shows only the 7 in-scope files changed/created
- [ ] `plans/README.md` status row for 009 updated

## STOP conditions

Stop and report back (do not improvise) if:
- `pnpm install` cannot resolve `vitest@^3.2.0` (e.g. blocked by the workspace's
  `minimumReleaseAge` policy). Report the error; do not pin a random older version.
- Importing `./utils` in a test fails because one of its transitive deps
  (`remark`, `strip-markdown`, `@date-fns/tz`) won't load under vitest's node
  transform. Report the exact error — do not start mocking modules without reporting first.
- The `getDailyDateToday` June test does **not** return `{ month: "june", day: "13" }`.
  That means a timezone/clock assumption is wrong — report it; do **not** edit
  `getDailyDateToday` (that function's fix is plan 010, and even then not for June).
- `pnpm test` errors at the Turbo level before running any package.

## Maintenance notes

- Plans 010 and 011 add more tests to `utils.test.ts` and `like.test.ts` using
  this runner. Keep the config's `include` glob (`src/**/*.test.ts`) intact.
- The environment is `node`. If a later plan needs to test a React hook or
  component (e.g. a jsdom-based test of `useShowActions`, plan 012's deferred
  follow-up), add `jsdom` and switch that file's environment with a
  `// @vitest-environment jsdom` docblock comment — don't flip the global default.
- A reviewer should confirm CI actually runs `pnpm test` on the first PR after this lands.
