# Default to HTML artifacts

When work make something human need to **read, review, compare, or tune** — specs, plans, code reviews, reports, prototypes, one-off editors — render as self-contained HTML file, not Markdown or terminal text.

HTML carry tables, CSS, SVG diagrams, interactive controls, spatial layout Markdown cannot. Render in any browser, upload + share by link, hand control back via export buttons. Markdown force fallbacks like ASCII diagrams or unicode swatches; 100+ line `.md` hard to navigate, rarely read full. Token cost higher but tiny against 1M context window — expressiveness + human engagement win.

Default HTML unless deliverable genuinely plain text (commit message, shell one-liner, code patch) or user ask for Markdown/text.

## How to build artifacts

- **Single self-contained file.** Inline CSS + JS. No build step, no external assets — must open straight from disk in browser.
- **Write to disk**, no dump HTML into chat. Clear name: `plan-auth.html`, `review-pr-481.html`, `report-token-bucket.html`. Tell user path.
- **Keep constellation, not one mega-doc.** Prefer several purpose-built files for different facets over one giant plan. Keep as reference context for later verification.
- **Use real structure:** tabs, visual hierarchy, color-coded severity, responsive grid, SVG flowcharts + module diagrams — whatever raise info density.

## Stay-in-the-loop: always export back

Interactive artifacts must hand state back so loop close. Add **copy/export buttons** serialize UI state into re-ingestible form:

- "Copy as JSON" / "Copy as prompt" / "Copy as Markdown" / "Copy diff"
- Slider params → copyable config
- Edited content → diff or structured payload to paste back

Human tune in browser, export, paste back — I act on it.

## Use cases and starter prompts

**Specs / planning / exploration** — compare approaches side by side, mock data flows.
> "Generate 6 distinctly different approaches — vary layout, tone, density — laid out in a
> single HTML file as a grid so I can compare side by side."

**Code review / understanding** — render diff with inline margin annotations.
> "Create an HTML artifact describing this PR. Focus on streaming/backpressure logic.
> Render the diff with inline margin annotations and color-coded severity."

**Design / prototypes** — interactive knobs for animations + components.
> "HTML file with sliders to try options on this animation; copy button to export the
> working parameters."

**Reports / research / learning** — synthesize code, git log, Slack/Linear (via MCP) into one explainer.
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

Artifacts better with real context — read filesystem, git log, available MCP sources (Slack, Linear) before generating, so diagrams + annotations reflect actual code and history, not guesses.