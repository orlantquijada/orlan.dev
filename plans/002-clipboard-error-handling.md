# Plan 002: Make clipboard-copy actions fail gracefully across daily and portfolio-v2

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 5caeab0..HEAD -- apps/daily/src/components/Actions.tsx apps/portfolio-v2/src/lib/general.ts apps/portfolio-v2/src/components/Contact/ContactDialog.tsx apps/portfolio-v2/src/components/Unicode.tsx apps/portfolio-v2/src/components/Notes/NoteDetailComponents/CopyButton.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (easier to verify after 001, but not required)
- **Category**: correctness
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

Four components call `navigator.clipboard.writeText(...)` with no failure
handling. The Clipboard API **rejects** on a denied permission or a non-secure
context (HTTP, some mobile webviews) — `ContactDialog.tsx` even documents this in
a code comment ("does not work on mobile & localhost"). Today those rejections
are unhandled promise rejections, and in three of the four the success state
(`setCopied(true)`) is simply skipped with no feedback and a console error. The
fix is one small shared helper that returns success/failure, applied at all four
sites, plus removing a dead `// TODO:` comment.

## Current state

Repo conventions: portfolio-v2 keeps small shared helpers in
`apps/portfolio-v2/src/lib/general.ts` (currently exports `cn`, `isBrowser`,
`useIsomorphicLayoutEffect`). daily keeps helpers in `apps/daily/src/lib/utils.ts`.

**Site 1 — `apps/daily/src/components/Actions.tsx`** (lines 101-115), the share button:
```tsx
<FooterButton
  onClick={() => {
    navigator.clipboard
      .writeText(`${BASE_URL}/${month}/${day}`)
      .then(() => {
        // TODO:
        toastRef.current?.open();
      });
  }}
  size="small"
>
```
The `.then()` correctly only opens the toast on success, but there is no
`.catch()` (unhandled rejection on failure) and a dangling `// TODO:` comment.

**Site 2 — `apps/portfolio-v2/src/components/Contact/ContactDialog.tsx`** (lines 17-26):
```tsx
const [copied, setCopied] = useState(false);

// NOTE: does not work on mobile & localhost (permission problem)
const copyEmail = async () => {
  await navigator.clipboard.writeText(EMAIL);
  setCopied(true);
  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
```

**Site 3 — `apps/portfolio-v2/src/components/Unicode.tsx`** (lines 11-19):
```tsx
const [copied, setCopied] = useState(false);

const copy = async () => {
  await navigator.clipboard.writeText(char);
  setCopied(true);
  setTimeout(() => {
    setCopied(false);
  }, 1500);
};
```

**Site 4 — `apps/portfolio-v2/src/components/Notes/NoteDetailComponents/CopyButton.tsx`** (lines 6-14):
```tsx
const [copied, setCopied] = useState(false);

const copyCode = async () => {
  await navigator.clipboard.writeText(code);
  setCopied(true);
  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
```

## Commands you will need

| Purpose            | Command                                       | Expected            |
|--------------------|-----------------------------------------------|---------------------|
| Astro typecheck    | `pnpm --filter portfolio-2.0 astro check`     | 0 errors            |
| Build portfolio-v2 | `pnpm --filter portfolio-2.0 build`           | exit 0              |
| Build daily        | `pnpm --filter daily build`                   | exit 0              |
| Lint               | `pnpm lint`                                   | exit 0              |

(If plan 001 has landed, `pnpm typecheck` covers the first three.)

## Scope

**In scope**:
- `apps/portfolio-v2/src/lib/general.ts` (add `copyToClipboard` helper)
- `apps/portfolio-v2/src/components/Contact/ContactDialog.tsx`
- `apps/portfolio-v2/src/components/Unicode.tsx`
- `apps/portfolio-v2/src/components/Notes/NoteDetailComponents/CopyButton.tsx`
- `apps/daily/src/components/Actions.tsx`

**Out of scope**:
- `@repo/utils` (it is framework-agnostic and not imported by daily — do not put
  the helper there).
- The daily app's `lib/utils.ts` — Actions.tsx is the only daily clipboard site;
  fix it inline rather than adding a one-off helper.
- Any toast/UI redesign. Do not add new error UI; the goal is no false success
  and no unhandled rejection.

## Steps

### Step 1: Add a `copyToClipboard` helper to portfolio-v2

In `apps/portfolio-v2/src/lib/general.ts`, append:
```ts
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
```
**Verify**: `pnpm --filter portfolio-2.0 astro check` → 0 errors.

### Step 2: Use it in ContactDialog, Unicode, CopyButton

For each of the three portfolio-v2 components, import the helper and gate
`setCopied(true)` on success. Also clear any pending timer before starting a new
one (prevents the checkmark reverting early on rapid clicks).

**ContactDialog.tsx** — replace the `copyEmail` function (keep the import line for
`copyToClipboard` added at the top, and add `useRef`):
```tsx
import { type ComponentProps, type ReactNode, useRef, useState } from "react";
import { copyToClipboard } from "@/lib/general";
// ...
const [copied, setCopied] = useState(false);
const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

const copyEmail = async () => {
	const ok = await copyToClipboard(EMAIL);
	if (!ok) {
		return;
	}
	setCopied(true);
	clearTimeout(timer.current);
	timer.current = setTimeout(() => setCopied(false), 2000);
};
```
Apply the same shape to **Unicode.tsx** (`copyToClipboard(char)`, 1500ms; import
`useRef` and `copyToClipboard` from `@/lib/general` — note Unicode already imports
`cn` from `@/lib/general`, so extend that import) and **CopyButton.tsx**
(`copyToClipboard(code)`, 2000ms; add the `copyToClipboard` import).

**Verify**: `pnpm --filter portfolio-2.0 astro check` → 0 errors; `pnpm --filter portfolio-2.0 build` → exit 0.

### Step 3: Fix the daily Actions share button

In `apps/daily/src/components/Actions.tsx`, update the share `onClick` (remove the
dead `// TODO:` and add a `.catch`):
```tsx
onClick={() => {
  navigator.clipboard
    .writeText(`${BASE_URL}/${month}/${day}`)
    .then(() => {
      toastRef.current?.open();
    })
    .catch(() => {
      // clipboard can reject on denied permission / insecure context;
      // best-effort share, so do not open the success toast on failure
    });
}}
```
**Verify**: `pnpm --filter daily build` → exit 0.

## Test plan

No test framework exists; verification is typecheck + build + a grep guard, plus
a manual smoke check:
- After changes: `grep -rn "clipboard.writeText" apps` → every match is either
  inside `copyToClipboard` (general.ts) or the daily `.then().catch()` chain;
  **no bare `await navigator.clipboard.writeText(...)` without try/catch** remains.
- `grep -n "// TODO:" apps/daily/src/components/Actions.tsx` → no matches.
- Manual: open the Contact dialog locally over `http://localhost` (where the API
  rejects) and click Copy — the app must not throw an unhandled rejection and must
  not show the checkmark.

## Done criteria

ALL must hold:
- [ ] `pnpm --filter portfolio-2.0 astro check` → 0 errors
- [ ] `pnpm --filter portfolio-2.0 build` and `pnpm --filter daily build` → exit 0
- [ ] `pnpm lint` → exit 0
- [ ] `grep -rn "clipboard.writeText" apps` shows all four sites wrapped (helper or `.catch`)
- [ ] `grep -n "// TODO:" apps/daily/src/components/Actions.tsx` → no matches
- [ ] `git status` shows only the 5 in-scope files
- [ ] `plans/README.md` status row for 002 updated

## STOP conditions

- The `copyToClipboard` import path `@/lib/general` does not resolve in one of the
  components (it should — that's the alias used across portfolio-v2).
- Any component's existing markup makes the minimal edit ambiguous (the JSX has
  drifted from the excerpts above).
- `astro check` was not passing **before** your change (a pre-existing failure is
  not yours to fix here — report it).

## Maintenance notes

- If a visible "copy failed" message is ever wanted, `copyToClipboard` already
  returns a boolean — branch on it at the call site.
- A reviewer should confirm no site shows a success checkmark/toast when the copy
  actually failed.
- Optional follow-up: clear `timer.current` in a `useEffect` cleanup on unmount.
  Omitted here as React 19 no longer warns on post-unmount `setState` and the
  clear-before-set already prevents stacking.
