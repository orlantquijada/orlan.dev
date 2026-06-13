# Plan 012: Fix swapped destructuring in `useShowActions` ("always show on desktop")

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan in
> `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 5caeab0..HEAD -- apps/daily/src/hooks/useShowActions.ts apps/daily/src/components/Actions.tsx`
> Then compare the "Current state" excerpts below against the live files. On a
> mismatch (the excerpt isn't there), treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `5caeab0`, 2026-06-13

## Why this matters

`useShowActions` decides whether the floating action bar (like / share / back) is
visible. Its intent, per its own comment, is **"always show on desktop."** But it
destructures the result of `useIsMinWidthTabDimensions` in the **wrong order**, so
the two booleans are swapped and the desktop guard is inverted:

- During measurement it returns `true` (shows — incidental).
- On desktop **after** measurement it falls through to the scroll-based path
  instead of always showing, so on a wide screen with tall content the action bar
  stays hidden until the user scrolls past 65px.

The hook `useIsMinWidthTabDimensions` returns `[isMinTabDimes, loading]`.
`Actions.tsx:39` consumes the same hook **correctly** as
`const [isMinTabDimes] = useIsMinWidthTabDimensions();` — that's the proof of the
intended tuple order, and that the bug is in `useShowActions`, not the hook.

Why typecheck didn't catch it: the returned tuple is
`readonly [boolean | undefined, boolean]`, and both slots are assignable to the
names, so the swap is type-compatible — only the runtime meaning is wrong.

## Current state

- `src/hooks/useShowActions.ts:6-17` — the consumer with the swapped destructure:
  ```ts
  export function useShowActions() {
    const show = useShowOnScroll(PAGE_OFFSET);
    const isContentScrollable = useIsContentScrollable();
    const [loading, isMinTabDimes] = useIsMinWidthTabDimensions(); // <-- swapped

    // always show on desktop
    if (!loading && isMinTabDimes) {
      return true;
    }

    return isContentScrollable ? show : true;
  }
  ```
- `src/hooks/useShowActions.ts:55-68` — the hook's actual return order
  (`[isMinTabDimes, loading]`):
  ```ts
  export function useIsMinWidthTabDimensions() {
    const [isMinTabDimes, setIsMinTabDimes] = useState<boolean>();

    useLayoutEffect(() => {
      const htmlElement = document.querySelector("html");
      if (htmlElement) {
        setIsMinTabDimes(htmlElement.clientWidth >= TAB_WIDTH);
      }
    }, []);

    const loading = isMinTabDimes === undefined;

    return [isMinTabDimes, loading] as const;
  }
  ```
- `src/components/Actions.tsx:39` — correct usage of the same hook (reference):
  ```ts
  const [isMinTabDimes] = useIsMinWidthTabDimensions();
  ```

## Commands you will need

| Purpose      | Command                          | Expected on success    |
|--------------|----------------------------------|------------------------|
| Typecheck    | `pnpm --filter daily typecheck`  | exit 0                 |
| Lint         | `pnpm --filter daily lint`       | exit 0                 |

## Scope

**In scope** (the only file you may modify):
- `apps/daily/src/hooks/useShowActions.ts`

**Out of scope** (do NOT touch):
- `useIsMinWidthTabDimensions`'s return order — it is correct and
  `Actions.tsx:39` depends on `[isMinTabDimes, loading]`. Do **not** "fix" it by
  swapping the return; that would break `Actions.tsx`.
- `Actions.tsx` — already consumes the hook correctly.

## Git workflow

- Branch: `advisor/012-daily-show-actions-destructure` (or the repo's convention).
- Commit style: conventional commits (e.g. `fix(daily): correct useShowActions destructure order`).
- Do NOT push or open a PR unless the operator asked.

## Steps

### Step 1: Swap the destructured names to match the hook's return order

In `src/hooks/useShowActions.ts`, change line 9 from:
```ts
  const [loading, isMinTabDimes] = useIsMinWidthTabDimensions();
```
to:
```ts
  const [isMinTabDimes, loading] = useIsMinWidthTabDimensions();
```
Leave the guard (`if (!loading && isMinTabDimes) return true;`) and everything
else unchanged — it is correct once the names bind to the right slots.

**Verify**: `pnpm --filter daily typecheck` → exit 0; `pnpm --filter daily lint` → exit 0.

## Test plan

No automated test in this plan: `useShowActions` reads live DOM measurements
(`window.scrollY`, `clientWidth`, element heights) and there is no jsdom test
environment configured (plan 009 sets up a `node`-only runner). Verification is:

- **Static**: the destructured order in `useShowActions` now matches the
  `[isMinTabDimes, loading]` returned by `useIsMinWidthTabDimensions`, and matches
  how `Actions.tsx:39` reads the same hook.
- **Manual (recommended)**: run `pnpm --filter daily dev`, open a day page
  (e.g. `/june/13`) on a viewport ≥768px wide with content tall enough to scroll.
  The action bar should be visible immediately, without scrolling.

## Done criteria

ALL must hold:
- [ ] `pnpm --filter daily typecheck` exits 0
- [ ] `pnpm --filter daily lint` exits 0
- [ ] `useShowActions.ts` line 9 reads `const [isMinTabDimes, loading] = useIsMinWidthTabDimensions();`
- [ ] `git status` shows only `useShowActions.ts` changed
- [ ] `plans/README.md` status row for 012 updated

## STOP conditions

Stop and report back (do not improvise) if:
- Swapping the names produces a type error (it should not — both slots are
  assignable). That would mean the hook's signature changed; re-read it.
- You find another consumer of `useIsMinWidthTabDimensions` that relies on the
  *swapped* order (none exists at plan time — `Actions.tsx` uses the correct order).

## Maintenance notes

- A jsdom-based hook test would guard this regression. It's deferred because the
  test runner added in plan 009 is `node`-only; adding one means installing
  `jsdom` and giving this hook's test a `// @vitest-environment jsdom` docblock.
- Reviewer: confirm the desktop action bar is visible without scrolling on a
  ≥768px viewport, and that mobile behavior (show-on-scroll) is unchanged.
