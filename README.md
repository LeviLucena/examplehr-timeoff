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

**Vercel deploy:** [examplehr-timeoff-tau.vercel.app](https://examplehr-timeoff-tau.vercel.app) · Storybook: [/storybook/](https://examplehr-timeoff-tau.vercel.app/storybook/)

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

## Data Flow Architecture

```
Browser ──► Next.js Route Handler (/api/hcm/*)
                 │
                 ▼
          Mock HCM Store (src/lib/mock-hcm-data.ts)
                 │
                 ▼
          HCM Client (src/lib/hcm-client.ts)
                 │
                 ▼
          Store (Context + useReducer)
                 │
            ┌────┴────┐
            ▼         ▼
      Employee    Manager
        View        View
```

1. **Route Handlers** (`src/app/api/hcm/`) — mock HCM REST API with realistic latency, random failures, and balance validation
2. **HCM Client** (`src/lib/hcm-client.ts`) — typed fetch wrappers that deserialize responses and surface errors
3. **Store** (`src/lib/store.tsx`) — React Context + `useReducer`, the single source of UI state. Dispatches actions optimistically, reconciles with server responses, manages 30s polling and role switching
4. **Components** — pure renderers that read from context and dispatch actions. No component holds server state directly

## Key Design Decisions

- **Optimistic updates with rollback** — UI responds instantly on submit/approve/deny by mutating local state first. If HCM rejects (failure, conflict, or insufficient balance), the action is rolled back and a notification explains why. This keeps the UI feeling fast while staying honest to the server.
- **Periodic reconciliation** — balances are polled every 30s to catch external mutations (work anniversaries, new year rollovers). A stale indicator shows freshness. Polling was chosen over WebSockets/SSE because we don't control the HCM server.
- **Defensive HCM handling** — the mock simulates real-world failure modes: variable latency (200ms–2s), random failures (10%), silent failures (HTTP 200 with error body), insufficient balance rejections (5% conflict), and malformed requests returning 400.
- **Role switching** — a single toggle switches the store between Employee and Manager roles, demonstrating both sides of the request lifecycle without separate routes or authentication.

## State Management: Why Context + useReducer?

| Approach | Considered | Verdict |
|----------|-----------|---------|
| **Context + useReducer** | ✅ Chosen | Demonstrates explicit reconciliation logic; no extra dependencies; built into React |
| Zustand | ❌ Not chosen | Less explicit about data flow; another dependency to justify |
| TanStack Query | ❌ Not chosen | Great for caching but hides the optimistic-rollback logic the exercise tests |
| Redux | ❌ Not chosen | Overkill for this scope; too much boilerplate |

## Mock HCM: Simulated Failure Modes

| Scenario | Trigger | HTTP Status | UI Response |
|----------|---------|-------------|-------------|
| Success | 85% chance | 200 | Normal flow |
| Random failure | 10% chance | 500 | Error notification, rollback if optimistic |
| Insufficient balance | 5% chance | 409 | "Insufficient balance" error, rollback |
| Silent failure | Random | 200 with `{error: ...}` | Checked client-side, treated as failure |
| Invalid employee | Bad ID | 400 | Validation error on submission |
| Conflicting request | Duplicate type | 409 | Conflict notification |

## UI States Covered in Storybook

Each component has stories for all its visual states. Below is the full matrix:

| Component | States |
|-----------|--------|
| **BalancesTable** | loading, empty, live, stale, error, refreshing |
| **RequestForm** | idle, submitting, submitting with animation, insufficient balance, conflict error, server error |
| **RequestList** | loading, empty, pending requests list, approved, denied |
| **ApprovalCard** | pending, approving, approving with animation, denied, approved, error on approve, error on deny |
| **EmployeeView** | loading, live with balances, empty with no balances, error, stale |
| **ManagerView** | loading, live with pending approvals, empty (no approvals), error |
| **Notification** | success, error, info, dismiss animation |

## Testing Strategy

- **Unit tests** (`src/lib/__tests__/store-reducer.test.ts`): 12 tests covering every reducer action — submit, approve, deny, rollback on failure, rollback on conflict, polling update, role switch, clear notification. Tests run with Vitest.
- **Browser interaction tests** (`.stories.ts` files): Storybook play functions that simulate user interactions — filling the form, clicking submit, approving a request, denying a request. Tests run with `vitest-browser-react` and verify DOM state after each action.

## Security Considerations

- Mock HCM endpoints validate employee IDs and request payloads, returning 400 for malformed input
- Client-side XSS prevention via React's built-in escaping (no `dangerouslySetInnerHTML`)
- In production: authentication middleware, rate limiting, CSRF protection, and input sanitization would be added
- No secrets, tokens, or credentials are committed to the repository

## Technical Requirement Document

See [docs/TRD.md](./docs/TRD.md) for the full architecture decision record, alternative analysis, and test strategy.

## Deliverables

- [x] TRD
- [x] Source code
- [x] Storybook — local: `npm run storybook` · deployed: [/storybook/](https://examplehr-timeoff-tau.vercel.app/storybook/)
- [x] Unit tests (12 passing)
- [x] Browser interaction tests
- [x] Deployed on Vercel — [examplehr-timeoff-tau.vercel.app](https://examplehr-timeoff-tau.vercel.app)

## Screenshots

![Your Balances](https://iili.io/CK6D6dP.jpg)
![Pending Approvals](https://iili.io/CK6moMv.jpg)
![Storybook](https://iili.io/CK6prrl.jpg)
