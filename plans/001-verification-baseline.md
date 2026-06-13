# Plan 001: Add a typecheck gate and minimal CI so type errors and broken builds can't ship silently

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 5caeab0..HEAD -- turbo.json package.json apps/portfolio-v2/package.json apps/daily/package.json apps/portfolio/package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

This monorepo has **zero tests and no CI**. For the Astro app (`portfolio-v2`,
the live main site) the type system isn't even a gate: `astro build` does **not**
typecheck, so a type regression there ships silently. `next build` (daily,
portfolio v1) does typecheck, but nothing runs automatically on push. The
cheapest, highest-leverage safety net is: a `typecheck` task wired into Turbo +
a minimal CI workflow that runs lint, typecheck, and build on every push/PR.
This unblocks every later change in `plans/` — they become verifiable instead of
"looked fine locally."

## Current state

- `turbo.json` — no `typecheck` task exists:
  ```json
  {
    "$schema": "https://turborepo.org/schema.json",
    "ui": "tui",
    "tasks": {
      "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
      "lint": { "outputs": [] },
      "format": {},
      "dev": { "cache": false, "persistent": true }
    }
  }
  ```
- `apps/portfolio-v2/package.json` scripts (note: `build` is `astro build`, which does NOT typecheck; `@astrojs/check` + `@astrojs/ts-plugin` ARE installed):
  ```json
  "scripts": {
    "dev": "astro dev", "start": "astro dev", "build": "astro build",
    "preview": "astro preview", "astro": "astro",
    "check": "biome check --write src/", "lint": "biome check", "format": "biome format --write"
  }
  ```
- `apps/daily/package.json` scripts: `"build": "next build"`, `"lint": "biome check"` (no typecheck script). `next build` typechecks by default.
- `apps/portfolio/package.json` scripts: `"build": "next build"`, `"prepare": "panda codegen"` (Panda generates `styled-system/` types on install).
- `package.json` (root) scripts: `build`, `dev`, `lint` (`turbo run lint`), `format`. `packageManager: "pnpm@11.5.0"`. `.tool-versions`: `node 24`.
- **No `.github/` directory exists.**

Repo conventions: pnpm workspace with a shared catalog (`pnpm-workspace.yaml`),
Biome (ultracite preset) for lint/format, Turbo for task running. Match the
existing script naming style (lowercase, no namespace).

## Commands you will need

| Purpose          | Command                                   | Expected on success |
|------------------|-------------------------------------------|---------------------|
| Install          | `pnpm install --frozen-lockfile`          | exit 0              |
| Lint (all)       | `pnpm lint`                               | exit 0              |
| Typecheck (new)  | `pnpm typecheck`                          | exit 0              |
| Build (all)      | `pnpm build`                              | exit 0              |
| Astro typecheck  | `pnpm --filter portfolio-2.0 astro check` | exit 0, 0 errors    |

(`portfolio-2.0` is the package `name` in `apps/portfolio-v2/package.json`.)

## Scope

**In scope** (the only files you should modify/create):
- `apps/portfolio-v2/package.json` (add `typecheck` script)
- `apps/daily/package.json` (add `typecheck` script)
- `apps/portfolio/package.json` (add `typecheck` script)
- `turbo.json` (add `typecheck` task)
- `package.json` (root — add `typecheck` script)
- `.github/workflows/ci.yml` (create)

**Out of scope** (do NOT touch):
- Any `.ts` / `.tsx` / `.astro` **source** file. If a typecheck surfaces real
  type errors, that is a STOP condition — report them; fixing them is a separate plan.
- `biome.json`, any `tsconfig.json`, the pnpm catalog.

## Steps

### Step 1: Add the Astro typecheck script (the real gap)

In `apps/portfolio-v2/package.json`, add to `scripts`:
```json
"typecheck": "astro check"
```
**Verify**: `pnpm --filter portfolio-2.0 typecheck` → exits 0 with 0 errors.
(`astro check` runs `astro sync` first automatically, generating `.astro/types.d.ts`.)
If it reports **real type errors in source**, STOP — see STOP conditions.

### Step 2: Add the daily typecheck script

In `apps/daily/package.json`, add to `scripts`:
```json
"typecheck": "tsc --noEmit"
```
**Verify**: `pnpm --filter daily typecheck` → exits 0.
**Escape hatch**: Next.js generates route types under `.next/types` during a
build. If `tsc --noEmit` fails *only* with errors about missing generated Next
types (not real source errors), run `pnpm --filter daily build` once, then
re-run. If it still produces framework-type noise that a clean `next build`
does not, set the script to `"typecheck": "next build"` instead and note this in
your status update — `next build` already typechecks, so the gate is still met.

### Step 3: Add the portfolio v1 typecheck script

In `apps/portfolio/package.json`, add to `scripts`:
```json
"typecheck": "tsc --noEmit"
```
v1 uses Panda; its `styled-system/` types come from `panda codegen` (the
`prepare` script, run on `pnpm install`). If types are missing, run
`pnpm --filter portfolio prepare` first.
**Verify**: `pnpm --filter portfolio typecheck` → exits 0 (apply the same
escape hatch as Step 2 if needed).

### Step 4: Wire the Turbo task and root script

In `turbo.json`, add a `typecheck` task inside `tasks`:
```json
"typecheck": { "dependsOn": ["^typecheck"], "outputs": [] }
```
In root `package.json` `scripts`, add:
```json
"typecheck": "turbo run typecheck"
```
**Verify**: `pnpm typecheck` → exits 0; Turbo runs `typecheck` for every package
that defines it. (Packages without a `typecheck` script are simply skipped.)

### Step 5: Create the CI workflow

Create `.github/workflows/ci.yml`:
```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 11.5.0
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm build
```
**Verify**: the file is valid YAML and the three `run` commands match the root
`package.json` script names. (You cannot run GitHub Actions locally; confirm by
running each command in order locally — they must all exit 0.)

## Test plan

No test framework exists in this repo, and this plan does not add one. Verification
is the typecheck + build gate itself:
- `pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck && pnpm build` → all exit 0.

## Done criteria

ALL must hold:
- [ ] `pnpm typecheck` exits 0 (runs `astro check` for portfolio-v2 + `tsc`/`next build` for the Next apps)
- [ ] `pnpm lint` exits 0
- [ ] `pnpm build` exits 0
- [ ] `.github/workflows/ci.yml` exists and is valid YAML
- [ ] `git status` shows only the 6 in-scope files changed/created
- [ ] `plans/README.md` status row for 001 updated

## STOP conditions

Stop and report back (do not improvise) if:
- Any typecheck reveals **real source type errors** (in `.ts`/`.tsx`/`.astro`).
  Report the exact errors; do not edit source to fix them — that is a separate plan.
- `astro check` cannot run (e.g. requires network access that is unavailable).
- The daily/v1 `tsc --noEmit` produces framework-type noise you cannot resolve
  with the Step 2 escape hatch.
- The `turbo.json` task syntax causes `pnpm typecheck` to error before running
  any package.

## Maintenance notes

- When tests are added later, append a `test` task to Turbo and a `pnpm test`
  line to `ci.yml`.
- Consider later making `build` depend on `typecheck` (`"dependsOn": ["^build", "typecheck"]`)
  so a type error blocks a build. Left out here to keep the change low-risk.
- Turbo remote/local caching in CI is a possible follow-up (faster runs); not included.
- A reviewer should confirm CI actually triggers on the first PR after this lands.
