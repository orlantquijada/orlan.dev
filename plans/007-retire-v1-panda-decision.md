# Plan 007 (decision): Decide whether to retire portfolio v1 and the Panda CSS packages

> **Executor instructions**: This plan produces a **recommendation document and a
> decision** — it does NOT delete or modify any app, package, or config. Because
> `apps/portfolio` is wired for deployment, nothing may be removed without the
> repo owner's explicit confirmation. Your deliverable is `plans/007-decision.md`
> (the inventory + recommendation) and, only if the owner confirms retirement, a
> follow-up deletion plan. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: confirm the import situation still holds:
> `grep -rn "from \"components\"\|from \"styled\|from 'components'\|from 'styled" apps packages --include='*.ts' --include='*.tsx' --include='*.astro' | grep -v node_modules`
> If anything **other than `apps/portfolio/**` and `packages/ui/**`** now imports
> `components`/`styled`, treat it as a STOP condition (the premise changed).

## Status

- **Priority**: P3
- **Effort**: S (it's analysis + a doc, not code)
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

The repo carries **two CSS systems**. `portfolio-v2` (the live main site) and
`daily` use **Tailwind 4**. `apps/portfolio` (v1) uses **Panda CSS**, and is the
**only** consumer of `packages/ui/components` and `packages/ui/styled` (the Panda
design system) — confirmed by import grep. v1 itself is a near-empty WIP
placeholder (a name + "Full Stack Developer & Freelancer" + a WIP banner) and has
its own `vercel.json`, so it is (or was) set up to deploy.

So the entire Panda stack — 2 packages, the `@pandacss/*` catalog entries, the
`panda.config.ts` files, the `panda codegen` prepare steps — exists to serve a
placeholder. **If** v1 is no longer wanted, retiring it collapses the repo to a
single styling system and removes a meaningful amount of surface. **But that's a
product call the advisor can't make** — v1 is deployed, and the owner may intend
to revive it. This plan gathers the facts and frames the decision; it does not act.

## Current state (verified facts)

- **Tailwind users**: `apps/portfolio-v2` (live), `apps/daily`. Shared helpers via
  `@repo/utils` (date/motion helpers) — *not* the Panda packages.
- **Panda users**: `apps/portfolio` only. Imports:
  - `apps/portfolio/src/pages/index.tsx` → `components` (`Box`, `Text`), `styled/css`, `styled/recipes`
  - `apps/portfolio/src/components/WIPBanner.tsx` → `components` (`Banner`), `styled`, `styled/css`
  - `apps/portfolio/panda.config.ts` → `styled` (preset)
  - `packages/ui/components/*` internally import `styled/*`
- **v1 content**: `apps/portfolio/src/pages/index.tsx` renders just a heading +
  `<WIPBanner/>`. `apps/portfolio/vercel.json` sets a region + font cache headers.
- **Catalog**: `pnpm-workspace.yaml` carries `@pandacss/dev`, `@pandacss/preset-panda`
  (used only by the Panda stack), plus a `packages/ui/*` workspace glob.
- **README** lists packages that don't exist (`eslint-config-custom`, `tsconfig`) —
  relevant context for the doc, but its own fix is finding F9, not this plan.

## Scope

**In scope**: creating `plans/007-decision.md` (analysis + recommendation), and —
only after explicit owner confirmation — authoring a follow-up deletion plan
`plans/008-retire-portfolio-v1.md`.

**Out of scope (hard)**: deleting or editing `apps/portfolio`, `packages/ui/*`,
`pnpm-workspace.yaml`, any `panda.config.ts`, or catalog entries. No source or
config changes in this plan.

## Steps

### Step 1: Establish v1's deployment status (ask the owner)

Determine, from the owner / the Vercel dashboard:
- Is `apps/portfolio` deployed to a live URL today? Which one? Does it receive traffic?
- Is there intent to revive v1, or has `portfolio-v2` fully superseded it?
- Is the Panda design system (`components`/`styled`) wanted for any future app?

Record the answers in `plans/007-decision.md`. **Do not proceed to a deletion plan
without a clear "v1 is retired" answer.**

### Step 2: Inventory the exact removal set (for the doc)

List precisely what retiring v1 would remove, so the decision is informed:
- `apps/portfolio/` (the app)
- `packages/ui/components/`, `packages/ui/styled/`
- `pnpm-workspace.yaml`: the `@pandacss/dev` and `@pandacss/preset-panda` catalog
  entries, and the `packages/ui/*` glob (verify nothing else needs it)
- Any root devDependency used only by Panda (check `package.json`)
- README references

And what is **lost**: the `components` primitives (`Box`/`Text`/`Flex`/`Grid`/`Pill`/`Banner`)
and the `styled` design tokens/recipes. Confirm `portfolio-v2` reimplements these
needs in Tailwind (it does) so nothing live depends on them.

### Step 3: Write the recommendation

In `plans/007-decision.md`, present two branches:
- **If retire**: recommend the deletion order (app first, then packages, then
  catalog/glob, then `pnpm install` to re-resolve the lockfile), note the blast
  radius (low — no live consumer besides v1), and flag the lockfile churn. Then —
  only with owner sign-off — author `plans/008-retire-portfolio-v1.md` as a normal
  executable plan with verification gates.
- **If keep**: recommend documenting the split in the README (why two CSS systems
  exist, which app uses which) so the situation reads as intentional, not as drift,
  and so future contributors/agents don't "consolidate" a live app by mistake.

## Done criteria

- [ ] `plans/007-decision.md` exists with: v1 deployment status (from the owner),
      the exact removal set, what's lost, and a clear recommendation for each branch.
- [ ] No source/app/package/config files changed (`git status` shows only files under `plans/`).
- [ ] If — and only if — the owner confirmed retirement: `plans/008-retire-portfolio-v1.md`
      drafted with full verification gates.
- [ ] `plans/README.md` status row for 007 updated.

## STOP conditions

- The drift-check grep shows a **new** consumer of `components`/`styled` outside
  `apps/portfolio` and `packages/ui` — the premise changed; report and re-scope.
- The owner is unavailable to confirm v1's status — leave the decision doc at
  "pending owner input" and STOP; do not delete anything on assumption.
- Any instinct to "just delete it while I'm here" — that violates this plan's hard
  scope. v1 is deployed.

## Maintenance notes

- This is the safe gate in front of a tempting-but-risky deletion. The whole point
  is that a deployed app and a 2-package design system are not something to remove
  on an advisor's inference.
- If kept, revisit when v1 either gets real content (justifies Panda) or is
  formally sunset (then run plan 008).
