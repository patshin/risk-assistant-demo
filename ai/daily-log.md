# AI Daily Log

## 2026-06-17 - Initial Setup

### Done

- Created the Codex Burst workflow documentation structure.
- Captured current project memory, task queue, and decision log.
- Removed the stale handover document from the workflow source of truth.

### Changed Files

- `AGENTS.md`
- `ai/memory.md`
- `ai/tasks.md`
- `ai/decisions.md`
- `ai/daily-log.md`
- `ai/burst-template.md`
- `HANDOVER.md`

### Tests / Checks

- Documentation-only change. Build not required.

### Decisions

- Use `AGENTS.md` and `ai/` files as the maintained AI workflow source of truth.
- Treat old handover notes as stale and remove them.

### Open Issues

- Project memory should be updated after future route, data, or architecture changes.
- Task queue should be pruned as UI work is completed.

### Tomorrow Priority

- Use `ai/burst-template.md` for the next focused Codex Burst.

## 2026-06-17 - Credit Warning / Default Migration Burst

### Done

- Added a new `预警与出险` tab to the credit risk module.
- Built the credit migration monitoring page with AI summary, metrics, trend chart, risk factor distribution, subsidiary risk cards, AI predicted customers, and AI action recommendations.
- Updated the large-customer risk tab to show the `AI 统计摘要` card from the full customer risk page in place of the old section title.
- Polished the AI summary action buttons so labels stay on one line with tighter icon/text spacing.

### Changed Files

- `src/pages/CreditRiskPage.tsx`
- `src/data/creditCustomers.ts`
- `src/components/BottomAskBar.tsx`
- `src/styles/global.css`
- `ai/daily-log.md`
- `ai/tasks.md`
- `ai/memory.md`
- `ai/decisions.md`

### Tests / Checks

- `npm run build` passed.
- No standalone lint, typecheck, or test scripts are defined in `package.json`.
- In-app browser visual checks were performed on `/credit` for the new tab, AI interactions, bottom input placeholder, button layout, and large-customer summary placement.

### Issues / Risks

- The repository already had unrelated modified and untracked files before closeout; they were left untouched.
- The new credit migration page uses local mock data and static AI-style responses only.

### Follow-up Tasks

- Consider a later mobile visual QA pass across all credit risk tabs after final demo copy is settled.
