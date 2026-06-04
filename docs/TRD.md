# Technical Requirement Document (TRD) — ExampleHR Time-Off Frontend

## 1. Overview

ExampleHR needs a time-off request frontend that presents balances and manages request lifecycles while being **honest about the fact that the HCM system owns the data**. The HCM (modelled after Workday/SAP) is the source of truth. The frontend must feel instant and trustworthy despite network latency and the possibility of stale or conflicting data.

## 2. Challenges & Proposed Solutions

### 2.1 Optimistic vs Pessimistic Updates

**Challenge:** When a user submits a request, waiting for HCM confirmation creates a poor UX (spinners, perceived slowness). But showing immediate success that later turns into failure is also bad.

**Solution: Optimistic updates with rollback.** The UI immediately shows the request as pending with the updated balance. If HCM rejects, we roll back the optimistic state and surface a clear error notification. This gives the user instant feedback while remaining honest about the outcome.

**Alternative considered:** Pure pessimistic (wait for HCM) — rejected because it feels slow. Pure optimistic (always trust the client) — rejected because HCM can reject or silently fail.

### 2.2 Cache Invalidation & Reconciliation

**Challenge:** HCM balances can change outside ExampleHR (work anniversaries, new year rollovers). The app may be open in a browser tab while these changes happen underneath.

**Solution: Periodic polling (30s interval) + stale indicators.** After each poll, if balances changed, the UI updates and shows a visual indicator. The balance table shows a green/yellow dot indicating freshness. If a fetch fails, the UI shows stale data with a warning rather than blanking out.

**Alternative considered:** WebSockets/SSE — not appropriate because we don't control the HCM server. Manual refresh button — supplementary but not sufficient.

### 2.3 Background Refresh vs In-Flight User Action

**Challenge:** User fills out a request form. Meanwhile, a background poll updates balances. The user's available balance may have changed.

**Solution:** The store separates "last known balances" from "currently syncing." The form uses the latest available data. If a background refresh changes balances during form input, the stale indicator updates but the form keeps its state. On submission, HCM does its own validation and can reject if insufficient.

### 2.4 Defensive HCM Responses

**Challenge:** HCM can return success but the request was actually denied, or can silently fail.

**Solution:** After submission, the UI reconciles by:
1. Checking the response status code
2. Reading the `syncedAt` timestamp to ensure freshness
3. Issuing a follow-up read to confirm the new balance

## 3. Architecture

### 3.1 Technology Choices

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 16 (App Router) | Required by spec; enables API routes + frontend in one project |
| State Management | React Context + useReducer | Sufficient for this scope; avoids external dependencies; easy to test |
| API Client | Native fetch | Simple; no abstraction needed over HCM's REST-like interface |
| Mock HCM | Next.js Route Handlers | Co-located with app; easy to test; simulates real latency/failures |
| Testing | Vitest + Storybook interaction tests | Chosen for integration with Storybook; browser-level tests |
| Component Dev | Storybook 10 | Required by spec; visual proof of all states |
| Styling | Inline styles | Avoids build complexity; keeps Storybook setup simple |

**Alternative considered:** Zustand for state — more ergonomic but adds a dependency. TanStack Query — excellent for this use case but its caching abstractions would hide the explicit reconciliation logic the spec asks us to demonstrate.

### 3.2 Component Tree

```
App (page.tsx)
├── Header (role switch + branding)
├── EmployeeView
│   ├── BalancesTable (loading | empty | error | stale | live)
│   ├── RequestForm (idle | submitting | error | no-balances)
│   └── RequestList (loading | empty | error | populated)
├── ManagerView
│   ├── ApprovalCard[] (pending | approved | denied | error)
│   └── RequestList (same as above, filtered)
└── Notification (success | error)
```

### 3.3 Data Flow

```
User Action → Store dispatch → Optimistic state update → UI re-render
                                     ↓
                              HCM API call
                                     ↓
                          ┌────────────────────┐
                          │ Success?            │
                          └────────┬───────────┘
                                   │
                      ┌────────────┴────────────┐
                      ▼                         ▼
              Confirm state               Rollback state
              Refresh balances           Show error notification
              Show success               Refresh balances
```

## 4. Mock HCM Endpoints

| Endpoint | Method | Description | Behaviors Simulated |
|----------|--------|-------------|---------------------|
| `/api/hcm/balances` | GET | Batch corpus of all balances | Random 10% failure, variable latency, employeeId filter |
| `/api/hcm/balance` | GET | Single balance read | Invalid dimension error, silent failure |
| `/api/hcm/requests` | POST | Submit time-off request | Insufficient balance rejection, 5% conflict, silent failure |
| `/api/hcm/requests` | PUT | Approve/deny request | Conflict on already-reviewed, not-found |
| `/api/hcm/requests` | GET | List pending requests | Normal response with variable latency |

Work anniversary bonuses are triggerable via `triggerWorkAnniversaryBonus()` for testing.

## 5. UI States (Storybook Coverage)

| Component | State | Description |
|-----------|-------|-------------|
| BalancesTable | Loading | Skeleton while fetching |
| BalancesTable | Empty | No balances returned |
| BalancesTable | Error | HCM unavailable |
| BalancesTable | Live | Fresh data with green indicator |
| BalancesTable | Stale | Last sync failed, showing cached data |
| RequestForm | Default | Ready for input |
| RequestForm | Submitting | Request in flight |
| RequestForm | Error | Submission rejected (insufficient balance) |
| RequestForm | No Balances | Employee has no balances |
| RequestList | Loading | Skeleton state |
| RequestList | Empty | No pending requests |
| RequestList | Populated | Requests displayed |
| RequestList | Error | Failed to load |
| ApprovalCard | Pending | Awaiting manager action |
| ApprovalCard | Approved | After approval |
| ApprovalCard | Denied | After denial |
| ApprovalCard | Optimistic | Immediately after action, before confirmation |
| ManagerView | Loading | Loading requests |
| ManagerView | Empty | No pending approvals |
| ManagerView | Populated | List of pending requests |
| Notification | Success | Green toast |
| Notification | Error | Red toast |

## 6. Test Strategy

| Test Type | Scope | What It Guards Against |
|-----------|-------|----------------------|
| Unit tests (Vitest) | Reducer logic | State transitions are correct |
| Component tests (Vitest + jsdom) | Individual components | Correct rendering per props |
| Storybook interaction tests | Component behavior | Click, type, submit flows work |
| Integration tests (Vitest + browser) | Full employee/manager flow | End-to-end request lifecycle |

**Decision:** We use Storybook interaction tests as the primary UI test mechanism because they exercise real browser behavior and provide visual regression proof. Unit tests cover the store reducer for confidence in state logic.

## 7. Deliverables

1. **TRD** — this document
2. **Source code** — Next.js App Router project in GitHub repository
3. **Storybook** — deployed or runnable with `npm run storybook`
4. **Tests** — runnable with `npx vitest run`
