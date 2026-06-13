# Plan 003: Stop preloading redundant woff font copies in portfolio-v2

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 5caeab0..HEAD -- apps/portfolio-v2/src/components/Fonts.astro`
> If the file changed since this plan was written, compare the "Current state"
> excerpt against the live code before proceeding; on a mismatch, treat it as a
> STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

`Fonts.astro` preloads Inter Regular and Inter Medium in **both** `.woff2` and
`.woff`, and lists both formats in each `@font-face` `src`. A `<link rel="preload">`
forces the browser to download the resource regardless of which `@font-face`
format it ends up using — so every page eagerly downloads two `.woff` files that
no modern browser will use (woff2 support is >96% globally). This is wasted
bandwidth on the critical path of every route. The fix: drop the `.woff`
preloads and the `.woff` `src` fallbacks, keeping `.woff2` only.

## Current state

`apps/portfolio-v2/src/components/Fonts.astro` — full file:
```astro
<link rel="preload" href="/fonts/Redaction-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="preload" href="/fonts/Redaction-Italic.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="preload" href="/fonts/Redaction_70-Italic.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="preload" href="/fonts/Inter-Regular.woff" as="font" type="font/woff" crossorigin="anonymous">
<link rel="preload" href="/fonts/Inter-Medium.woff2" as="font" type="font/woff2" crossorigin="anonymous">
<link rel="preload" href="/fonts/Inter-Medium.woff" as="font" type="font/woff" crossorigin="anonymous">

<style is:global>
	@font-face {
		font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap;
		src: url("/fonts/Inter-Regular.woff2") format("woff2"), url("/fonts/Inter-Regular.woff") format("woff");
	}
	@font-face {
		font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap;
		src: url("/fonts/Inter-Medium.woff2") format("woff2"), url("/fonts/Inter-Medium.woff") format("woff");
	}
	@font-face { font-family: "Redaction"; font-style: normal; font-weight: 400; font-display: swap;
		src: url("/fonts/Redaction-Regular.woff2") format("woff2"); }
	@font-face { font-family: "Redaction"; font-style: italic; font-weight: 400; font-display: swap;
		src: url("/fonts/Redaction-Italic.woff2") format("woff2"); }
	@font-face { font-family: "Redaction"; font-style: italic; font-weight: 600; font-display: swap;
		src: url("/fonts/Redaction_70-Italic.woff2") format("woff2"); }
</style>
```
(The Redaction faces already use woff2 only — leave them unchanged. The two Inter
faces are the ones with redundant `.woff`.)

`apps/portfolio-v2/public/fonts/` contains both `Inter-Regular.woff` /
`Inter-Regular.woff2` and `Inter-Medium.woff` / `Inter-Medium.woff2`.

## Commands you will need

| Purpose            | Command                              | Expected |
|--------------------|--------------------------------------|----------|
| Build portfolio-v2 | `pnpm --filter portfolio-2.0 build`  | exit 0   |
| Astro typecheck    | `pnpm --filter portfolio-2.0 astro check` | 0 errors |

## Scope

**In scope**: `apps/portfolio-v2/src/components/Fonts.astro` only.

**Out of scope**:
- The `.woff` files in `apps/portfolio-v2/public/fonts/` — leave them on disk
  (deleting unused assets is a separate, optional cleanup; keeping them is harmless).
- `apps/portfolio-v2/src/styles/global.css` (defines `--font-family-*` vars — unchanged).
- The Redaction `@font-face` blocks and their preloads.
- daily / portfolio v1 font setup.

## Steps

### Step 1: Remove the two `.woff` preload links

Delete these two lines from `Fonts.astro`:
```astro
<link rel="preload" href="/fonts/Inter-Regular.woff" as="font" type="font/woff" crossorigin="anonymous">
<link rel="preload" href="/fonts/Inter-Medium.woff" as="font" type="font/woff" crossorigin="anonymous">
```

### Step 2: Drop the `.woff` fallback from the two Inter `@font-face` blocks

Change each Inter `src` to woff2 only:
```css
@font-face {
	font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap;
	src: url("/fonts/Inter-Regular.woff2") format("woff2");
}
@font-face {
	font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap;
	src: url("/fonts/Inter-Medium.woff2") format("woff2");
}
```

**Verify**: `pnpm --filter portfolio-2.0 build` → exit 0.

## Test plan

No automated tests. Verify by build + grep + a manual visual check:
- `grep -c 'rel="preload"' apps/portfolio-v2/src/components/Fonts.astro` → `5`
  (3 Redaction + Inter-Regular.woff2 + Inter-Medium.woff2).
- `grep -n 'format("woff")' apps/portfolio-v2/src/components/Fonts.astro` → no matches
  (only `format("woff2")` remains).
- Manual: `pnpm --filter portfolio-2.0 dev`, open the homepage, confirm body text
  (Inter) and the "Orlan Quijada" header (Redaction) render in their intended
  fonts, and DevTools → Network shows no `Inter-*.woff` (non-woff2) request.

## Done criteria

ALL must hold:
- [ ] `pnpm --filter portfolio-2.0 build` → exit 0
- [ ] `grep -c 'rel="preload"' apps/portfolio-v2/src/components/Fonts.astro` → 5
- [ ] `grep -n 'format("woff")' apps/portfolio-v2/src/components/Fonts.astro` → no matches
- [ ] `git status` shows only `Fonts.astro` changed
- [ ] `plans/README.md` status row for 003 updated

## STOP conditions

- The live `Fonts.astro` no longer matches the "Current state" excerpt (drift).
- Manual check shows Inter failing to load (would imply something else references
  the `.woff`); report rather than re-adding blindly.

## Maintenance notes

- Possible follow-up (deferred): Redaction is only used in the header (every page,
  Regular weight) and the homepage `<h1>` (italic). The italic Redaction variants
  could be preloaded only on routes that use them, instead of globally. Lower
  confidence / more work — out of scope here.
- If the unused `public/fonts/Inter-*.woff` files are deleted later, confirm
  nothing references them first (`grep -rn "Inter-Regular.woff\b" apps/portfolio-v2`).
