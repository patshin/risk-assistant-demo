# AI Task Queue

## Today

### L3 / Codex Burst

- Candidate: Verify static deployment behavior with `HashRouter` across `/`, `/macro`, `/credit`, `/credit/customers`, `/investment`, `/watch`, and `/report`.
- Candidate: Make Global Copilot responses more page-context-aware without changing its visual structure.
- Candidate: Audit mobile responsive overflow on chip rows, cards, charts, and bottom sheets.

### L2 / Light Model

- Candidate: Extract repeated page-local mock structures only where reuse is obvious.
- Candidate: Refresh route and module notes after recent credit/macro migration.
- Candidate: Add concise comments for non-obvious chart or pagination helpers if needed.

### L1 / Manual

- Check screenshots on common mobile widths.
- Confirm final copy for leadership demo language.
- Confirm whether AI workflow docs should be updated after each larger UI change.

## Backlog

- Improve AI Copilot content variants for report generation, impact chain, tracking task, and disposal advice.
- Review all CTA labels for consistency.
- Consider a small visual QA checklist for demo readiness.
- Decide whether to keep all mock data local or prepare an API-shaped adapter layer.

## Done

- Added project AI workflow file plan.
- Switched routing to hash-based static deployment.
- Added full credit customer list page with filters and pagination.
- Moved industry credit risk from credit risk into macro risk.
- Added global AI Copilot bottom sheet interaction.
- Fixed multiple chart, chip, and card overflow issues during UI iteration.
- Added the credit risk `预警与出险` tab with AI-native credit migration monitoring.
- Moved the full customer risk `AI 统计摘要` card onto the large-customer risk tab.

## Task Classification Rules

- L3: Cross-file work, architecture, state management, API integration, complex responsive UI, failing tests, or TypeScript chain issues.
- L2: Single-file component edits, small utilities, mock data updates, documentation drafts, or isolated UI polish.
- L1: Copy edits, screenshot checks, tiny style tuning, or manual confirmation.
