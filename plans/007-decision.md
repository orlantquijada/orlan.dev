# 007 — Decision: retire portfolio v1 + the Panda CSS stack?

> Deliverable of [plan 007](007-retire-v1-panda-decision.md). Analysis + decision only —
> **no source, app, package, or config was changed.** A richer, browsable version of this
> doc lives in [`007-decision.html`](007-decision.html).
>
> Audited at commit `5caeab0`, 2026-06-13. Drift check (re-run on execution) was **clean**:
> every consumer of `components`/`styled` still sits inside `apps/portfolio/**` and
> `packages/ui/**` — no new consumer, premise intact.

## Decision (2026-06-13 — owner input)

| Question | Owner's answer |
|----------|----------------|
| Is `apps/portfolio` (v1) deployed / will it be revived? | **Keep it.** Still deployed; may revive. v2 has not formally sunset it. |
| Want the Panda design system (`components`/`styled`) for any *future* app? | **No** — v2 covers all visual needs in Tailwind. |

**Net action now: nothing is deleted.** Because v1 is being kept and v1 is the *only*
consumer of the Panda stack, the Panda packages cannot be removed without taking v1 with
them. The owner does not want Panda for future work, so **Panda's lifetime is bound to v1**:
when v1 is formally sunset, retire the Panda stack in the same motion (sketch: §"If retire").

This is the **Keep** branch. Follow-up: **document the two-CSS-system split** so it reads as
intentional, not as drift a future contributor/agent might "consolidate" away. (Done criteria
of plan 007 forbid editing non-`plans/` files, so the README change is *recommended here*,
not performed — see §"Recommended README change".)

**Plan 008 (deletion) is NOT authored** — it is gated on a clear "v1 is retired" answer,
which was not given.

## Current state (verified facts)

- **Two CSS systems.** `apps/portfolio-v2` (live at orlan.dev) and `apps/daily` use
  **Tailwind 4**. `apps/portfolio` (v1) uses **Panda CSS**.
- **v1 content** (`apps/portfolio/src/pages/index.tsx`): a heading
  ("Orlan Quijada / Full Stack Developer & Freelancer") + `<WIPBanner/>` ("In Progress…").
  A placeholder. `apps/portfolio/vercel.json` sets `regions: ["hkg1"]` + font cache headers
  → it is wired to deploy.
- **Panda is v1-only.** Sole runtime consumers of `components` / `styled`:
  - `apps/portfolio/src/pages/index.tsx` → `Box`/`Text` (`components`), `css`/`cx`, `_flex`/`text` recipes
  - `apps/portfolio/src/components/WIPBanner.tsx` → `Banner` (`components`), `CSS` type, `css`
  - `apps/portfolio/panda.config.ts` → `preset` from `styled`
  - `packages/ui/components/src/*` import `styled/*` **internally only** (Box, Text, Flex, Grid, Pill, Banner)
- **Shared code that is NOT Panda**: `packages/utils` (`@repo/utils`) — date/motion helpers —
  is used by the Tailwind apps. It is unrelated to the Panda stack and **stays**.
- **README is already stale** (finding F9): lists `eslint-config-custom` and `tsconfig`
  packages that do not exist. Real packages: `packages/ui/*` (Panda) + `packages/utils`.

## Inventory: the exact removal set (for an informed decision)

What a future retirement *would* remove. Listed so the Keep decision is made with eyes open,
and so plan 008 can lift this verbatim when v1 is sunset.

| # | Target | Note |
|---|--------|------|
| 1 | `apps/portfolio/` (whole app) | incl. `vercel.json`, `panda.config.ts`, `WIPBanner.tsx` |
| 2 | `packages/ui/components/` | Box, Text, Flex, Grid, Pill, Banner |
| 3 | `packages/ui/styled/` | Panda preset, tokens, recipes, patterns, generated `styled-system/` |
| 4 | `pnpm-workspace.yaml`: catalog `@pandacss/dev` + `@pandacss/preset-panda` | Panda-exclusive — safe to drop |
| 5 | `pnpm-workspace.yaml`: the `packages/ui/*` glob | dead once `packages/ui/*` gone; **keep `packages/*`** (holds `packages/utils`) |
| 6 | root `package.json`: the `dev:p` script (`turbo run dev --filter=portfolio`) | + any `turbo.json` ref to the portfolio app |
| 7 | `README.md`: rewrite the stale "Apps and Packages" list | also closes F9 |
| 8 | `pnpm install` | re-resolve the lockfile; drops all `@pandacss/*` transitive deps |

**Catalog correction (important):** `@tsconfig/strictest` is **NOT** Panda-only — it is also
used by `packages/utils/package.json` (a live `@repo/utils` dep) and the `tsconfig2.json`
files. **Do not** remove it. Plan 007's Step-2 sketch implied checking root devDeps for
Panda-only entries: there are none (root devDeps are `@biomejs/biome`, `turbo`, `ultracite`).

### What is lost on retirement

- The `components` primitives: **Box, Text, Flex, Grid, Pill, Banner**.
- The `styled` design tokens + recipes + patterns + `jsx` factory.
- The `WIPBanner` motion animation (v1-only).

Confirmed **nothing live depends on these** — `portfolio-v2` reimplements its visual needs
directly in Tailwind 4. The only consumer is the v1 placeholder.

### Blast radius

**LOW.** No shared runtime dependency on Panda outside v1. The lockfile churn is large but
mechanical (many `@pandacss/*` entries vanish in one `pnpm install`). The only real risk is
deleting a **deployed** app — which is exactly why this is gated on owner sign-off, and why
the answer here is Keep.

## Recommendation — both branches

### If KEEP  ✅ (chosen)

1. **Document the split** so the two CSS systems read as intentional (see below). This is the
   single highest-value follow-up: it stops a future agent/contributor from "consolidating"
   a live app by mistake.
2. Leave the Panda stack untouched. Its cost (2 packages, 2 catalog entries, 3 `panda.config.ts`,
   `panda codegen` prepare steps) is the price of keeping v1 alive.
3. **Revisit when** v1 either gets real content (justifies Panda) or is formally sunset
   (then run plan 008 using the removal set above).

#### Recommended README change (not applied — out of plan-007 scope)

`README.md` currently lists non-existent packages (`eslint-config-custom`, `tsconfig`) and
doesn't explain the two-CSS-system split. Replace the "Apps and Packages" section with the
real inventory and a one-line rationale, e.g.:

```markdown
### Apps and Packages

- `apps/portfolio` — Portfolio v1 (WIP). **Next.js + Panda CSS.** Sole consumer of the
  Panda design system below; kept live pending a possible revival.
- `apps/portfolio-v2` — Portfolio v2, the live site at orlan.dev. **Astro + React + Tailwind 4.**
- `apps/daily` — Daily Stoic PWA. **Next.js + Tailwind 4.**
- `packages/ui/styled` + `packages/ui/components` — the **Panda CSS** design system
  (tokens, recipes, Box/Text/Flex/Grid/Pill/Banner). Used only by v1.
- `packages/utils` (`@repo/utils`) — shared date/motion helpers used by the Tailwind apps.

> Two CSS systems coexist on purpose: v1 (Panda) predates the move to Tailwind 4 in v2/daily.
> This is intentional, not drift — don't "consolidate" v1 away without retiring the app.
```

(Folding F9's fix into the same edit is the natural way to ship this.)

### If RETIRE  (not chosen — reference only)

Deletion order (each step verified before the next): **app → ui packages → catalog/glob →
root script + README → `pnpm install`**. Then author `plans/008-retire-portfolio-v1.md` as a
normal executable plan with gates: `pnpm install` resolves clean, `pnpm build` green for
`portfolio-v2` + `daily`, no dangling `components`/`styled`/`@pandacss` references
(`grep` clean), Vercel project for v1 removed/archived. Blast radius LOW per above; flag the
large-but-mechanical lockfile churn in the PR.

## Done-criteria trace (plan 007)

- [x] `007-decision.md` exists with v1 status (owner: keep), exact removal set, what's lost, recommendation per branch.
- [x] No source/app/package/config changed — only files under `plans/`.
- [x] Plan 008 **not** authored — correct: owner did not confirm retirement (the criterion is conditional on a "v1 is retired" answer).
- [x] `plans/README.md` 007 row updated to DONE.
