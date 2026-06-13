# Default to HTML artifacts

When work produces something a human needs to **read, review, compare, or tune** —
specs, plans, code reviews, reports, prototypes, or one-off editors — render it as a
self-contained HTML file instead of Markdown or terminal text.

HTML carries tables, CSS, SVG diagrams, interactive controls, and spatial layout that
Markdown can't. It renders in any browser, uploads and shares by link, and can hand
control back to me via export buttons. Markdown forces fallbacks like ASCII diagrams or
unicode color swatches; a 100+ line `.md` is hard to navigate and rarely read in full.
Token cost is higher but negligible against the 1M context window — expressiveness and
human engagement win.

Default to HTML unless the deliverable is genuinely plain text (a commit message, a
shell one-liner, a code patch) or the user explicitly asks for Markdown/text.

## How to build artifacts

- **Single self-contained file.** Inline CSS and JS. No build step, no external assets —
  it must open straight from disk in a browser.
- **Write to disk**, don't dump HTML into chat. Use a clear name: `plan-auth.html`,
  `review-pr-481.html`, `report-token-bucket.html`. Tell the user the path.
- **Keep a constellation, not one mega-doc.** Prefer several purpose-built files for
  different facets of a problem over one giant plan. Retain them as reference context for
  later verification passes.
- **Use real structure:** tabs, visual hierarchy, color-coded severity, responsive grid,
  SVG flowcharts and module diagrams — whatever raises information density.

## Stay-in-the-loop: always export back

Interactive artifacts must hand state back to me so the loop closes. Add **copy/export
buttons** that serialize UI state into something re-ingestible:

- "Copy as JSON" / "Copy as prompt" / "Copy as Markdown" / "Copy diff"
- Working parameters from sliders → copyable config
- Edited content → diff or structured payload to paste back

The human tunes in the browser, exports, pastes back — I act on it.

## Use cases and starter prompts

**Specs / planning / exploration** — compare approaches side by side, mock up data flows.
> "Generate 6 distinctly different approaches — vary layout, tone, density — laid out in a
> single HTML file as a grid so I can compare side by side."

**Code review / understanding** — render the diff with inline margin annotations.
> "Create an HTML artifact describing this PR. Focus on streaming/backpressure logic.
> Render the diff with inline margin annotations and color-coded severity."

**Design / prototypes** — interactive knobs for animations and components.
> "HTML file with sliders to try options on this animation; copy button to export the
> working parameters."

**Reports / research / learning** — synthesize code, git log, Slack/Linear (via MCP) into
one explainer.
> "Read the relevant code and produce a single HTML explainer: a token-bucket flow
> diagram, 3-4 annotated code snippets, and a 'gotchas' section."

**Custom editing interfaces** — throwaway, single-purpose editors.
> "HTML file with each ticket as draggable cards across Now/Next/Later/Cut columns, plus a
> 'copy as Markdown' export button."
> "Form-based editor for feature flags, grouped by area, warning on disabled
> prerequisites, with a 'copy diff' button."
> "Side-by-side prompt editor with variable slots highlighted and live template rendering
> of sample inputs."

## Pull in context

Artifacts get better with real context — read the filesystem, git log, and available MCP
sources (Slack, Linear) before generating, so diagrams and annotations reflect the actual
code and history, not guesses.
