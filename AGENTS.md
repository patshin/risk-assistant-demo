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
- `ai/`: Codex workflow memory, tasks, decisions, and burst templates.

Page files should compose UI and page flow. Put reusable UI in `src/components/`. Put complex data shaping or reusable logic in `src/data/`, `src/lib/`, or another suitable shared directory if introduced.

## UI / Interaction Style

- Keep the warm cream / beige background, soft orange gradients, orange emphasis, large rounded cards, and low-contrast shadows.
- Optimize for mobile executive scanning, not desktop dashboards.
- Avoid dense tables unless explicitly requested.
- Preserve the existing bottom AI input and global AI copilot interaction model.
- Horizontal chips may scroll, but should avoid visible scrollbars.

## Code Style

- Use TypeScript and React function components.
- Keep changes focused and local.
- Prefer existing patterns before introducing new abstractions.
- Add comments only when they clarify non-obvious logic.
- Do not introduce new dependencies unless you first explain why and wait for confirmation.

## Modification Scope

- Each task should do only the current goal.
- Do not opportunistically refactor unrelated code.
- If a task needs changes in more than 3 files, stop first and explain why, unless the user explicitly requested a multi-file workflow or documentation update.
- Do not touch generated files, dependencies, build output, or unrelated assets.

## Checks

- Primary check: `npm run build`
- Dev server: `npm run dev -- --host 127.0.0.1`
- For visual work, verify the relevant route in the in-app browser when practical.

## Codex Workflow

1. Read `AGENTS.md`, `ai/memory.md`, and relevant files before changing code.
2. State the intended scope before substantial edits.
3. Make the smallest useful change.
4. Run relevant checks when practical.
5. Summarize changed files, test results, and follow-up suggestions.
6. At the end of each task, say whether `ai/memory.md`, `ai/tasks.md`, `ai/decisions.md`, or `ai/daily-log.md` should be updated.

## Do Not

- Do not change business logic while performing documentation-only tasks.
- Do not add new libraries without approval.
- Do not rewrite visual language into a generic admin dashboard.
- Do not remove user changes unless explicitly requested.
- Do not scan or edit `node_modules/`, `.git/`, `dist/`, `build/`, generated files, or hidden folders unless the user specifically asks.
