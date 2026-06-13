# Plan 005 (spike): Fix the masonry layout so NotesSection can be re-enabled on the homepage

> **Executor instructions**: This is a SPIKE — investigate first, decide, then
> implement the chosen option. Follow the steps in order, run the verification
> commands, and honor the STOP conditions. When done, update the status row for
> this plan in `plans/README.md` and record which layout option you chose.
>
> **Drift check (run first)**: `git diff --stat 5caeab0..HEAD -- apps/portfolio-v2/src/components/Content.astro apps/portfolio-v2/src/components/NotesSection.astro apps/portfolio-v2/src/components/Notes/styles.module.css`
> If any changed since this plan was written, compare against "Current state"
> before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

The homepage (`Content.astro`) ends with a disabled feature:
```astro
<!-- TODO: fix masonry layout -->
<!-- <NotesSection/> -->
```
`NotesSection.astro` is fully built (it renders the 5 most recent notes + a
"View all" card) but is commented out because its masonry layout breaks. Shipping
it surfaces the notes — the thing the author actively writes — on the landing page.

**Root cause** (confirmed): the masonry in `Notes/styles.module.css` `.notesList`
is a *flexbox column-wrap* hack that needs a **fixed container height** to know
where to break into the next column. Both `NotesSection.astro` and the index's
`NotesList.tsx` compute that height from a hardcoded `HEIGHT = 100` px-per-card
estimate. Real `NoteCard`s vary in height (title length + optional description),
so the estimate is wrong and columns wrap at the wrong points (gaps or clipping).

## Current state

**`Notes/styles.module.css`** — the shared flexbox-masonry mechanism:
```css
.notesList {
	display: flex; flex-direction: column; flex-wrap: wrap; align-content: space-between;
}
.notesList > * { order: 1; width: 100%; margin-block-end: var(--mason-mb); }
@media (min-width: 640px) { .notesList > * { width: 49%; } /* + ::after + nth-child order rules */ }
@media (min-width: 768px) { .notesList > * { width: 32%; } /* + ::before/::after + nth-child order */ }
```
This requires the container to have an explicit height (set via `--smHeight`/`--mdHeight`).

**`NotesSection.astro`** (the homepage instance — **static, NO layout animations**):
```astro
const recentNotes = notesData.filter(({ data }) => !data.draft)
	.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
	.slice(0, 5).map((note) => ({ ...note.data, href: `/notes/${note.id}` }));

const HEIGHT = 100; // estimated height per card  ← the fragile assumption
const CARD_MARGIN_BOTTOM = 12;
const totalItems = recentNotes.length + 1; // +1 for "view all" card
const smHeight = toRem(Math.ceil(totalItems / 2) * (HEIGHT + CARD_MARGIN_BOTTOM));
const mdHeight = toRem(Math.ceil(totalItems / 3) * (HEIGHT + CARD_MARGIN_BOTTOM));
// renders <div class:list={[styles.notesList, "notes-masonry"]} style="--smHeight:...; --mdHeight:...">
//   {recentNotes.map(note => <NoteCard {...note} />)} + a "View all notes" card
```

**`NoteCard`** renders a title `<h3>` and an optional description `<p>` — variable height.

**Important distinction**: the index page (`NotesList.tsx`) uses the *same* flex
hack but ALSO drives `motion` FLIP layout animations when filtering tags (it sits
inside a `LayoutGroup`). The homepage `NotesSection` has **no** such animations,
so it can use a simpler layout that the animated index cannot.

## Commands you will need

| Purpose            | Command                              | Expected |
|--------------------|--------------------------------------|----------|
| Dev server         | `pnpm --filter portfolio-2.0 dev`    | serves locally |
| Build portfolio-v2 | `pnpm --filter portfolio-2.0 build`  | exit 0   |
| Astro typecheck    | `pnpm --filter portfolio-2.0 astro check` | 0 errors |

## Scope

**In scope**:
- `apps/portfolio-v2/src/components/NotesSection.astro` (replace the masonry approach + drop the `HEIGHT` calc)
- `apps/portfolio-v2/src/components/Content.astro` (add the import + un-comment `<NotesSection/>`)

**Out of scope**:
- `Notes/styles.module.css` — **do not change it.** It is shared with the animated
  index `NotesList.tsx`, whose FLIP animations depend on the flex hack. Give
  `NotesSection` its own scoped styles instead.
- `NotesList.tsx`, `NotesWrapper.tsx`, the notes content collection.

## Steps

### Step 1: Reproduce the break

Temporarily un-comment `<NotesSection/>` in `Content.astro` (add the import:
`import NotesSection from "./NotesSection.astro";`). Run
`pnpm --filter portfolio-2.0 dev`, open the homepage, and observe the notes block
at ≥640px and ≥768px widths. Record exactly what breaks (overlap? clipping? large
gap below? items in the wrong column?). This is your before-state.

### Step 2: Choose a layout approach (document the decision in your status note)

- **Option A — CSS `columns` (recommended).** Replace the flex hack on
  `NotesSection` with `column-count` (1 / 2 / 3 responsive) + `column-gap`, and
  `break-inside: avoid` on each child, container `height: auto`. This is true
  masonry with **no fixed-height assumption and no JS**. Trade-off: items flow
  top-to-bottom within each column (column-major order) rather than left-to-right;
  acceptable for a "recent notes" block. Works cleanly here precisely because
  `NotesSection` is static (no layout animation).
- **Option B — measure real heights** with a small client script / `ResizeObserver`
  feeding the existing `--smHeight`/`--mdHeight`. More code; keeps row-major order.
  Only pick this if Option A's column order is judged unacceptable.
- **Option C — plain responsive CSS grid** (`grid-template-columns: repeat(N, 1fr)`,
  equal rows). Simplest and b/ robust, but loses the staggered masonry look.
- **Rejected**: native `grid-template-rows: masonry` — not production-ready across
  browsers as of 2026.

### Step 3: Implement the chosen option on NotesSection only

Replace the `<style>` in `NotesSection.astro` (the `.notes-masonry` height rules)
and remove the now-unused `HEIGHT`/`CARD_MARGIN_BOTTOM`/`smHeight`/`mdHeight`
computation. Keep the "View all notes" card as the last item. Do not reference
`styles.module.css` `.notesList` for the masonry (you may keep it only if your
chosen option doesn't rely on the fixed height — Option A/C do not, so prefer
dropping it for a self-contained scoped style).

### Step 4: Re-enable on the homepage

In `Content.astro`, keep the import from Step 1 and replace:
```astro
<!-- TODO: fix masonry layout -->
<!-- <NotesSection/> -->
```
with:
```astro
<NotesSection />
```

**Verify**: `pnpm --filter portfolio-2.0 astro check` → 0 errors;
`pnpm --filter portfolio-2.0 build` → exit 0.

## Test plan

No automated tests. Manual verification at three widths on `dev`:
- **375px**: notes stack in a single column, no overlap, "View all" card last.
- **768px**: 2 columns, no clipping or large trailing gap.
- **1280px**: 3 columns, balanced.
- Cards with a long title AND cards with no description both lay out cleanly
  (this is the case the old `HEIGHT = 100` got wrong).

## Done criteria

ALL must hold:
- [ ] `pnpm --filter portfolio-2.0 astro check` → 0 errors
- [ ] `pnpm --filter portfolio-2.0 build` → exit 0
- [ ] `<NotesSection />` renders on the homepage (no commented-out block remains)
- [ ] `grep -n "HEIGHT = 100" apps/portfolio-v2/src/components/NotesSection.astro` → no match
- [ ] Manual: clean layout at 375 / 768 / 1280px with variable-height cards
- [ ] `git status` shows only the 2 in-scope files
- [ ] `plans/README.md` status row for 005 updated, with the chosen option noted

## STOP conditions

- The chosen option looks visibly worse than the old layout AND the fallback
  (Option C) also looks wrong — stop and report with a screenshot description.
- Re-enabling `NotesSection` requires data or props not available on the homepage
  (it shouldn't — it fetches its own collection) — stop and report.
- You find yourself needing to edit `Notes/styles.module.css` — that's out of
  scope (it would affect the animated index); stop and report instead.

## Maintenance notes

- If the index `NotesList.tsx` masonry is ever reworked to drop its own
  `HEIGHT = 100` assumption, reconcile both so the homepage and index share one
  approach. For now they intentionally differ (the index needs the flex hack for
  FLIP animations).
- A reviewer should resize the homepage across breakpoints, not just eyeball desktop.
