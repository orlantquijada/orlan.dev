# Plan 006 (spike): Make note-detail tag links filter the notes index (URL ↔ selected-tags sync)

> **Executor instructions**: This is a SPIKE — make the small design decisions
> noted below, then implement. Follow the steps in order, run the verification
> commands, honor the STOP conditions. When done, update the status row for this
> plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 5caeab0..HEAD -- apps/portfolio-v2/src/layouts/NotesLayout.astro apps/portfolio-v2/src/stores/notes.ts apps/portfolio-v2/src/components/Notes/NoteTagsList.tsx apps/portfolio-v2/src/components/Notes/NotesWrapper.tsx apps/portfolio-v2/src/pages/notes.astro`
> If any changed since this plan was written, compare against "Current state"
> before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

On a note **detail** page, the tags at the top are links that all point at bare
`/notes` (with a `<!-- TODO: filter notes by tag link -->`). Clicking one takes
you to the notes index but does **not** filter to that tag. The frustrating part:
the index **already has a complete, working tag filter** — it's just not
URL-addressable, so neither detail-page links nor shared URLs can drive it. This
plan closes that gap: detail tag links deep-link into the filter, and the filter
state is reflected in the URL (shareable, reloadable, back-button-friendly).

## Current state

The filtering machinery (all present and working on the index):
- **`stores/notes.ts`** — the selection state:
  ```ts
  import { atom } from "nanostores";
  export const $selectedTags = atom<string[]>([]);
  export function addTag(tag) { $selectedTags.set([...$selectedTags.get(), tag]); }
  export function removeTag(tag) { $selectedTags.set($selectedTags.get().filter(t => t !== tag)); }
  export function clearTags() { $selectedTags.set([]); }
  ```
- **`Notes/NoteTagsList.tsx`** — reads `useStore($selectedTags)`, toggles tags via
  `addTag`/`removeTag`, renders chips. Starts from whatever `$selectedTags` holds.
- **`Notes/NotesList.tsx`** — reads `useStore($selectedTags)` and filters:
  a note is "selected" when `_selectedTags.every(t => note.tags.includes(t))`.
- **`pages/notes.astro`** — renders `<NotesWrapper ... client:load />` and includes
  `<ClientRouter />` (Astro view transitions). The store starts **empty** on load;
  nothing reads the URL.
- **`layouts/NotesLayout.astro`** (lines 33-42) — the detail-page tag links to fix:
  ```astro
  <ul class="flex items-center">
    <!-- TODO: filter notes by tag link -->
    {[...data.tags].map((tag) => (
      <li class="tag">
        <a class="hover:underline" href="/notes">{tag}</a>
      </li>
    ))}
  </ul>
  ```
  This layout also includes `<ClientRouter />`.

## Design decisions (make these, then implement)

1. **URL shape**: use a query param `?tags=foo,bar` (supports the multi-tag
   selection the store already allows; shareable). Recommended over a hash.
2. **Sync direction**: do **both** — (a) on the index, seed `$selectedTags` from
   the URL on load; (b) when `$selectedTags` changes, reflect it back into the URL
   via `history.replaceState` so filtered views are shareable and survive reload.
3. **View transitions**: because both pages use `<ClientRouter>`, re-run the
   URL→store seeding on Astro's `astro:page-load` event (fires on initial load AND
   after each client-side navigation), not just once.
4. **Validation**: ignore tags from the URL that aren't in the known tag set
   (avoids an empty/garbage filter from a hand-edited URL).

## Commands you will need

| Purpose            | Command                              | Expected |
|--------------------|--------------------------------------|----------|
| Dev server         | `pnpm --filter portfolio-2.0 dev`    | serves locally |
| Build portfolio-v2 | `pnpm --filter portfolio-2.0 build`  | exit 0   |
| Astro typecheck    | `pnpm --filter portfolio-2.0 astro check` | 0 errors |

## Scope

**In scope**:
- `apps/portfolio-v2/src/layouts/NotesLayout.astro` (detail tag links → deep links)
- `apps/portfolio-v2/src/stores/notes.ts` (add URL-sync helpers)
- One mount point to call the seeding — prefer `Notes/NoteTagsList.tsx` or
  `Notes/NotesWrapper.tsx` (whichever you choose; document it).

**Out of scope**:
- The filtering logic in `NotesList.tsx` (it already works off `$selectedTags`).
- The tag-graph code in `lib/notes.ts`.
- Any redesign of the chip UI / animations.

## Steps

### Step 1: Deep-link the detail-page tag links

In `NotesLayout.astro`, change the tag link `href` (and remove the TODO comment):
```astro
{[...data.tags].map((tag) => (
  <li class="tag">
    <a class="hover:underline" href={`/notes?tags=${encodeURIComponent(tag)}`}>{tag}</a>
  </li>
))}
```

### Step 2: Add URL-sync helpers to the store

In `stores/notes.ts`, add (keeping the existing atom + add/remove/clear):
```ts
function readTagsFromURL(valid: string[]): string[] {
	if (typeof location === "undefined") return [];
	const raw = new URLSearchParams(location.search).get("tags");
	if (!raw) return [];
	const set = new Set(valid);
	return raw.split(",").map(decodeURIComponent).filter((t) => set.has(t));
}

export function initTagsFromURL(validTags: string[]) {
	$selectedTags.set(readTagsFromURL(validTags));
}

export function syncTagsToURL() {
	if (typeof history === "undefined") return;
	const tags = $selectedTags.get();
	const url = new URL(location.href);
	if (tags.length) url.searchParams.set("tags", tags.map(encodeURIComponent).join(","));
	else url.searchParams.delete("tags");
	history.replaceState(history.state, "", url);
}
```

### Step 3: Seed on mount + on view transitions; reflect changes back

In your chosen client component (e.g. `NoteTagsList.tsx`, which already has the
`tags` prop = the valid tag list and is `"use client"` via the island):
- On mount, call `initTagsFromURL(tags)`.
- Subscribe to `astro:page-load` (fires after ClientRouter navigations) to re-seed:
  `document.addEventListener("astro:page-load", () => initTagsFromURL(tags))`, and
  remove the listener on unmount.
- Subscribe to the store to keep the URL in sync:
  `const unsub = $selectedTags.subscribe(() => syncTagsToURL()); return unsub;`
  (a nanostores `.subscribe` returns its unsubscribe function).

Guard against double-initialization/flicker (see STOP conditions). Use the
existing `useEffect` patterns in the file.

**Verify**: `pnpm --filter portfolio-2.0 astro check` → 0 errors;
`pnpm --filter portfolio-2.0 build` → exit 0.

## Test plan

No automated tests. Manual on `dev`:
1. Open a note detail page → click a tag → lands on `/notes?tags=<tag>` with that
   chip pre-selected and the list filtered to notes having that tag.
2. On the index, select/deselect chips → the URL `?tags=` updates live.
3. Reload `/notes?tags=foo` → filter is restored from the URL.
4. Hand-edit the URL to an unknown tag → it's ignored (no broken/empty state).
5. Navigate detail → index → back → the filter state is consistent (view-transition path).

## Done criteria

ALL must hold:
- [ ] `pnpm --filter portfolio-2.0 astro check` → 0 errors
- [ ] `pnpm --filter portfolio-2.0 build` → exit 0
- [ ] `grep -n 'href="/notes"' apps/portfolio-v2/src/layouts/NotesLayout.astro` → no match (links now carry `?tags=`)
- [ ] Manual flows 1–5 above all pass
- [ ] `git status` shows only the in-scope files
- [ ] `plans/README.md` status row for 006 updated (note which mount point you used)

## STOP conditions

- `astro:page-load` re-seeding fights the store→URL subscription (infinite
  replaceState loop or visible chip flicker) and you can't resolve it with a guard
  — stop and report; the design may need a "user has interacted" flag.
- Tags contain characters that don't round-trip through `encodeURIComponent`/`decodeURIComponent`
  cleanly against the content collection's tag strings — report with an example.
- The notes index filter was already broken before your change — report; fixing it
  is not in this plan's scope.

## Maintenance notes

- If a tag is renamed in the content collection, old shared `?tags=` URLs silently
  drop it (validation ignores unknown tags) — acceptable, but note it.
- A reviewer should confirm the back/forward buttons behave (we use `replaceState`,
  so filter changes don't spam history; deep-link navigations still create entries).
- Consider later: a canonical/SEO note if filtered index URLs get indexed.
