# AI Decisions

## 2026-06-17

### Confirmed

- The project is a mobile-first AI risk control assistant demo for leadership-style review.
- Use warm cream / beige backgrounds, soft orange accents, rounded cards, and gentle shadows.
- Avoid turning pages into generic admin dashboards or dense tables.
- Use `HashRouter` so the built app can run on static hosting.
- Keep data local and mock-based unless API integration is explicitly requested.
- Credit risk now focuses on large customer risk and concentration risk.
- Credit risk also includes a `预警与出险` tab for credit migration monitoring and AI-assisted warning/default analysis.
- Industry credit risk belongs under macro risk rather than credit risk.
- Large customer risk home should show only the top 3 customers; full list lives on a separate customer list page.
- Global AI Copilot is shared across pages and opens as a bottom sheet by default.
- Codex should keep each task focused and avoid unrelated refactors.

### Open Questions

- Should Global Copilot eventually use a structured context object per page?
- Should mock data be normalized into a more API-like schema?
- Which routes need to be included in the final demo script?
- Should visual regression screenshots be maintained manually or through a lightweight checklist?
