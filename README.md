# ExampleHR — Time-Off Frontend

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Storybook](https://img.shields.io/badge/Storybook_10-FF4785?style=for-the-badge&logo=storybook&logoColor=white) ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white) ![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

Take-home assignment: a time-off request management frontend that presents balances and manages request lifecycles while staying honest about the fact that the HCM system (the source of truth) owns the data.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 |
| Component Dev | Storybook 10 |
| Testing | Vitest + Playwright |
| Mock API | Next.js Route Handlers |
| State | React Context + useReducer |

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm run storybook  # http://localhost:6006
npm test           # unit tests
```

## Project Structure

```
src/
├── app/
│   ├── api/hcm/           # Mock HCM endpoints
│   │   ├── balance/       # GET single balance
│   │   ├── balances/      # GET batch balances
│   │   └── requests/      # CRUD time-off requests
│   ├── layout.tsx
│   └── page.tsx           # Main page with role switching
├── components/
│   ├── BalancesTable.tsx   # Employee balance view
│   ├── RequestForm.tsx     # Time-off submission form
│   ├── RequestList.tsx     # Request list
│   ├── ApprovalCard.tsx    # Manager approve/deny card
│   ├── EmployeeView.tsx    # Employee view orchestrator
│   ├── ManagerView.tsx     # Manager view orchestrator
│   └── Notification.tsx    # Toast notifications
└── lib/
    ├── types.ts            # Shared types
    ├── mock-hcm-data.ts    # Mock HCM data store
    ├── hcm-client.ts       # API client
    └── store.tsx           # State management
```

## Key Design Decisions

- **Optimistic updates with rollback** — UI responds instantly; if HCM rejects, the optimistic state is rolled back with a clear error notification.
- **Periodic reconciliation** — balances are polled every 30s to catch external mutations (work anniversaries, new year rollovers). A stale indicator shows freshness.
- **Defensive HCM handling** — mock HCM simulates random failures (10%), silent failures, insufficient balance rejections (5% conflict), and variable latency.
- **Role switching** — toggle between Employee and Manager views to see both sides of the request lifecycle.

## UI States Covered

Stories for: loading, empty, error, stale, live, refreshing, submitting, insufficient balance, no balances, optimistic, and conflict states.

## Technical Requirement Document

See [docs/TRD.md](./docs/TRD.md) for the full architecture decision record, alternative analysis, and test strategy.

## Deliverables

- [x] TRD
- [x] Source code
- [x] Storybook (runnable with `npm run storybook`)
- [x] Unit tests (12 passing)
- [x] Browser interaction tests
