# AI Project Memory

Read this file before each Codex Burst to avoid re-learning the whole project.

## Product

Mobile H5/WebApp demo for an AI-native intelligent risk control assistant. It supports leadership-style risk review across macro, credit, investment, tracking, and reporting workflows.

## Tech Stack

- Vite
- React + TypeScript
- React Router using `HashRouter`
- Plain CSS with shared tokens
- Local mock data
- `lucide-react` icons

## UI Style

- Warm cream / beige page background.
- Soft orange gradients and orange emphasis.
- White or cream rounded cards.
- Gentle shadows and low-contrast borders.
- Mobile-first layout, executive scanability, no heavy table/dashboard feel.
- Global bottom AI input and AI Copilot are important interaction anchors.

## Main Modules

- `src/App.tsx`: route composition.
- `src/main.tsx`: React entry and router setup.
- `src/pages/`: main screens such as home, macro risk, credit risk, investment risk, tracking, report, and customer list.
- `src/components/`: reusable UI such as charts, tab bar, bottom ask bar, global copilot, status bar, and cards.
- `src/data/`: mock risk data and credit customer data.
- `src/styles/`: CSS tokens and global styles.

## Architecture Rules

- Page files compose components and route-level layout.
- Reusable UI belongs in `src/components/`.
- Shared mock data and data helpers belong in `src/data/`.
- Keep changes focused; avoid unrelated refactors.
- Do not add dependencies without prior confirmation.
- If changing more than 3 files for a normal task, pause and explain why.

## Data / State

- Current data source is local mock data.
- Credit customer list data lives in `src/data/creditCustomers.ts`.
- Credit migration mock data also lives in `src/data/creditCustomers.ts`, including warning/default trend points, risk factor distribution, subsidiary risk distribution, and AI predicted customers.
- General risk demo data lives in `src/data/mockRisk.ts`.
- State is mostly local React component state.
- No backend API integration is currently confirmed.

## Recent Credit Risk Context

- Credit risk tabs are now `大户风险 / 集中度风险 / 预警与出险`.
- The `预警与出险` tab is positioned as an AI-native credit migration assistant, not a traditional BI dashboard.
- The large-customer risk tab now starts with the `AI 统计摘要` card before filters and the top customer cards.

## Known Issues

- Some mock data and UI logic remain page-local and may need gradual extraction later.
- Global AI Copilot is still demo/static and can be made more context-aware.
- After many UI iterations, mobile visual QA should continue across key routes.
- Static deployment should be checked with hash routes after every routing change.

## Short-term Goal

Stabilize the mobile demo UI, keep the warm AI risk assistant style consistent, and make future Codex work cheaper by using burst-sized prompts and compact project memory.

## How to Use This File

Before each burst, read this file plus `AGENTS.md`, `ai/decisions.md`, and only the files relevant to the current task. Update this file only when project structure, core behavior, or important constraints change.
