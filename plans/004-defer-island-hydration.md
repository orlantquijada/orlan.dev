# Plan 004: Defer below-the-fold island hydration in portfolio-v2

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 5caeab0..HEAD -- apps/portfolio-v2/src/components/Projects.astro apps/portfolio-v2/src/components/Header.astro`
> If either file changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as a
> STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW (Projects) / MED (Menu — see escape hatch)
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

Astro ships zero JS by default; each `client:*` directive opts an island into
hydration. Two islands hydrate **eagerly** (`client:load`) when they shouldn't:

1. The two project demo `<Video>` islands live in a tall, sticky, below-the-fold
   section, yet hydrate on initial load — pulling `useVideoControls` + icon SVGs
   into the critical path before the user can even see them.
2. The `<Menu>` in the header pulls in `motion` **and** Radix Popover and hydrates
   `client:load` on **every page**.

`client:visible` (hydrate when scrolled into view) is the correct fit for the
videos. The menu is trickier (it's above-the-fold nav), so it gets a softer
`client:idle` with an escape hatch. Note: the already-deferred islands
(`ImageLightbox` is `client:visible`, `VideoPreviewDialog`/`CopyButton` are
`client:idle`) are correct — **do not touch them**.

## Current state

**`apps/portfolio-v2/src/components/Projects.astro`** — two videos in a
`h-[200vh]`, `sticky` section (below the fold). Both are `client:load`:
```astro
<Video src="/stoic-demo2.mp4" type="video/mp4" className="aspect-93/80" client:load>
  <Icon name="pause" slot="pausedIcon" />
  <Icon name="play" slot="playingIcon" width={10} height={12} />
</Video>
...
<Video src="/jamm-add-fund2.mp4" className="aspect-6/13" type="video/mp4" client:load>
  <Icon name="pause" slot="pausedIcon" />
  <Icon name="play" slot="playingIcon" width={10} height={12} />
</Video>
```
`Video.tsx` sets `preload="none"` on the `<video>`, so the media itself is not
fetched until play — this change only defers the React hydration, not the video bytes.

**`apps/portfolio-v2/src/components/Header.astro`** (line 24):
```astro
<Menu client:load />
```
`Menu.tsx` imports `@radix-ui/react-popover` and `motion/react` (AnimatePresence,
MotionConfig, motion).

## Commands you will need

| Purpose            | Command                              | Expected |
|--------------------|--------------------------------------|----------|
| Build portfolio-v2 | `pnpm --filter portfolio-2.0 build`  | exit 0   |
| Dev server         | `pnpm --filter portfolio-2.0 dev`    | serves locally |

## Scope

**In scope** (directive changes only — no component logic):
- `apps/portfolio-v2/src/components/Projects.astro` (2 directives)
- `apps/portfolio-v2/src/components/Header.astro` (1 directive)

**Out of scope**:
- `Video.tsx`, `Menu.tsx`, `MenuPanel.tsx` — no logic changes.
- Any other `client:*` directive in the repo. Specifically leave
  `ImageLightbox` (`client:visible`), `VideoPreviewDialog` (`client:idle`),
  `CopyButton` (`client:idle`), `DuckSprite` (`client:only`), `UnicodeReact`,
  and `NotesWrapper` as they are.

## Steps

### Step 1: Defer the Projects videos to `client:visible`

In `Projects.astro`, change both `<Video ... client:load>` to `client:visible`.
**Verify**: `pnpm --filter portfolio-2.0 build` → exit 0; then
`grep -n "client:load" apps/portfolio-v2/src/components/Projects.astro` → no matches.

### Step 2: Soften the Menu to `client:idle`

In `Header.astro` line 24, change `<Menu client:load />` to `<Menu client:idle />`.

**Escape hatch (read before deciding)**: the Menu is above-the-fold navigation.
`client:idle` hydrates as soon as the main thread is idle (effectively instant on
a fast connection, a brief beat on a slow one). Run `pnpm --filter portfolio-2.0 dev`,
throttle the network/CPU in DevTools, and click the menu immediately after load.
If the menu button is unresponsive long enough to feel broken, **revert Header to
`client:load`** and keep only the Step 1 change (still a win). Record in your
status note which you chose and why.

**Verify**: `pnpm --filter portfolio-2.0 build` → exit 0.

## Test plan

No automated tests. Manual smoke test on `pnpm --filter portfolio-2.0 dev`:
- Scroll to the "Side Projects" section → each video's play/pause button toggles
  correctly (confirms the islands still hydrate, just later).
- Open the header menu → it opens/animates and the panel renders.
- (Optional) DevTools coverage/performance: confirm the Projects video JS is not
  in the initial hydration batch.

## Done criteria

ALL must hold:
- [ ] `pnpm --filter portfolio-2.0 build` → exit 0
- [ ] `grep -n "client:load" apps/portfolio-v2/src/components/Projects.astro` → no matches
- [ ] `Header.astro` uses `client:idle` for Menu **or** your status note documents a deliberate revert to `client:load`
- [ ] Manual: project videos toggle after scroll; header menu opens
- [ ] `git status` shows only the 2 in-scope files
- [ ] `plans/README.md` status row for 004 updated

## STOP conditions

- Either file no longer matches the "Current state" excerpt (drift).
- After switching Projects to `client:visible`, the video controls no longer work
  when scrolled into view — report rather than reverting silently.

## Maintenance notes

- If the Projects section is ever moved above the fold, revert it to `client:load`.
- The Menu's bundle size (motion + Radix Popover) is the real cost; a future plan
  could replace the popover with a lighter primitive. This plan only changes *when*
  it hydrates, not *what* it ships. A reviewer should weigh the Menu UX trade-off.
