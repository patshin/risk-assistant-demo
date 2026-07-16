# AGENTS.md

## Project

This repository is a mobile WebApp demo for an AI-native risk control assistant. It presents macro risk, credit risk, investment risk, tracking, reports, and a global AI copilot for leadership-style risk review.

## Tech Stack

- Vite + React + TypeScript
- React Router with `HashRouter` for static deployment
- Plain CSS with shared tokens in `src/styles/`
- Local mock data in `src/data/`
- Icons from `lucide-react`

## Directory Conventions

- `src/pages/`: page-level composition and route screens.
- `src/components/`: reusable UI components.
- `src/data/`: mock data and small data helpers.
- `src/styles/`: global CSS and design tokens.

Page files should compose UI and page flow. Put reusable UI in `src/components/`. Put complex data shaping or reusable logic in `src/data/`, `src/lib/`, or another suitable shared directory if introduced.

## Product Intent

The product should help users move through a complete risk-management loop:

discover risk -> assess importance -> understand causes -> evaluate impact -> decide actions -> assign ownership and deadlines -> track outcomes -> report and review.

Do not treat every screen as a dashboard. Each page should have a clear user, decision, and next action.

Primary user perspectives include:

- Executives: identify material changes, impact, decisions, and overdue actions.
- Risk leaders: analyze, prioritize, escalate, assign, and supervise.
- Risk specialists: verify evidence, investigate causes, execute actions, and track results.
- Risk managers: prepare monitoring, follow-up, and reporting materials.

Do not assume every role needs the same information density or interaction depth.

## Business Content and Evidence

- Treat user-provided production screenshots and confirmed business fields as important business inputs.
- Preserving a field does not mean displaying it on the first screen. Fields may be summarized, grouped, folded, filtered, or moved into drill-down views.
- Do not assume the current production layout or navigation is the target design.
- Separate confirmed requirements, repository evidence, inferred needs, and unvalidated product hypotheses.
- Mark unreadable or uncertain screenshot content as unknown instead of inventing values or relationships.
- Do not remove, rename, or reinterpret established business fields without explaining the product and business impact.

## AI Product Principles

- Do not add AI merely to make a page appear AI-native.
- Use AI when it materially reduces the cost of finding priorities, connecting evidence, explaining changes, preparing decisions, generating actions, or following up outcomes.
- Prefer deterministic filters, sorting, rules, charts, and templates when they solve the problem more reliably.
- AI outputs should expose supporting evidence, data time, relevant changes, assumptions, and uncertainty when applicable.
- Clearly distinguish source facts, rule-based results, model predictions, AI inference, AI recommendations, and human-confirmed decisions.
- Page-level AI should explain the current object or metric. The global copilot should support cross-module analysis and follow-up. Proactive alerts should require explicit triggers.
- Every proposed AI capability should identify its user, trigger, input data, output, user action, human confirmation point, and follow-up path.

## Domain Consistency

- Keep risk level, risk trend, warning status, limit status, management strategy, action status, and tracking priority as distinct concepts.
- Keep customer values and statuses consistent across overview, list, detail, tracking, and report pages.
- Do not invent business metrics solely to fill visual space.
- New mock fields must support a real page decision or be explicitly identified as a demo hypothesis.
- AI conclusions and recommended actions must be consistent with the underlying mock indicators, events, and risk status.

## UI / Interaction Style

- Keep the warm cream / beige background, soft orange gradients, orange emphasis, large rounded cards, and low-contrast shadows.
- Optimize for mobile executive scanning, not desktop dashboards.
- Avoid dense tables unless explicitly requested.
- Preserve the bottom AI input and global copilot as the current interaction baseline unless the task explicitly redesigns them. Do not add isolated AI widgets that duplicate the global copilot without a clear page-specific purpose.
- Horizontal chips may scroll, but should avoid visible scrollbars.

## Mobile Readability System

Use the shared typography tokens, spacing tokens, icon sizes, card styles, chips, buttons, `PageHeader`, `SectionTitle`, `MetricCard`, `PillTag`, and bottom AI input patterns before writing page-specific UI.

Do not invent page-specific title sizes, arbitrary icon sizes, or custom card rhythm unless the user explicitly asks. Optimize for iPhone-sized screens around 390px width: 22px page titles, 16–18px section titles, 14–15px body text, 12–13px secondary text, 18px default icons, 44–48px tap targets, and 16px page padding.

Avoid dense tablet-style layouts, tiny text, awkward label wrapping, multi-line chips, and dashboard-like information walls.

Capsule labels, status tags, badges, and chip buttons must vertically center their content with `inline-flex` or `flex`, `align-items: center`, and `justify-content: center`. Treat that layout mode as part of the shared component contract: do not override it with broad structural selectors such as `> span:first-child`; target a semantic class or explicitly exclude shared capsule classes. When touching a capsule, inspect the final computed styles after the full CSS cascade and verify the text is optically centered at the 390px mobile viewport.

## Code Style

- Use TypeScript and React function components.
- Keep changes focused and local.
- Prefer existing patterns before introducing new abstractions.
- Add comments only when they clarify non-obvious logic.
- Do not introduce new dependencies unless you first explain why and wait for confirmation.

## Modification Scope

- Each task should do only the current goal.
- Do not opportunistically refactor unrelated code.
- If a task is likely to touch more than 5 files or change architecture, explain the scope first before editing.
- Do not touch generated files, dependencies, build output, or unrelated assets.

## Checks

- Primary check: `npm run build`
- Dev server: `npm run dev -- --host 127.0.0.1`
- For visual work, verify the relevant route in the in-app browser when practical.
- Use a viewport around 390 x 844 as the primary mobile reference.
- Check first-screen priority, horizontal overflow, back navigation, tabs, filters, sheets, and drill-down paths.
- Confirm that the bottom AI input does not cover page content and inspect the browser console for errors.
- For routing or deployment work, verify HashRouter navigation, refresh behavior, and the GitHub Pages base path.

## Product Review Workflow

Before redesigning from screenshots or business references:

1. Inventory the visible fields, states, actions, and page relationships.
2. Separate confirmed facts from assumptions and open questions.
3. Identify whether each issue is caused by data, information architecture, workflow, business definition, or AI capability.
4. Define the user decision and next action for the page.
5. Implement only after the intended content hierarchy and workflow are clear.

## Codex Workflow

1. Read `AGENTS.md` and only the relevant source/configuration files before changing code.
2. State the intended scope before substantial edits.
3. Make the smallest useful change.
4. Run relevant checks when practical.
5. Summarize changed files, test results, and follow-up suggestions.
6. Do not create or update AI working-log documents unless the user explicitly asks.

## Do Not

- Do not change business logic while performing documentation-only tasks.
- Do not add new libraries without approval.
- Do not rewrite visual language into a generic admin dashboard.
- Do not remove user changes unless explicitly requested.
- Do not scan or edit `node_modules/`, `.git/`, `dist/`, `build/`, generated files, or hidden folders unless the user specifically asks.
