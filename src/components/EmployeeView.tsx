"use client";

import { useStore } from "@/lib/store";
import { BalancesTable } from "./BalancesTable";
import { RequestForm } from "./RequestForm";
import { RequestList } from "./RequestList";

export function EmployeeView() {
  const { state, submitTimeOff } = useStore();

  return (
    <div>
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Your Balances
        </h2>
        <BalancesTable
          balances={state.balances}
          loading={state.balancesLoading}
          stale={state.balancesStale}
          error={state.balancesError}
          lastSyncedAt={state.lastSyncedAt}
        />
      </section>

      <section style={{ marginBottom: 32 }}>
        <RequestForm
          balances={state.balances}
          employeeId={state.currentEmployeeId}
          submitting={state.submitting}
          error={state.submitError}
          onSubmit={submitTimeOff}
        />
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Your Requests
        </h2>
        <RequestList
          requests={state.pendingRequests.filter(
            (r) => r.employeeId === state.currentEmployeeId
          )}
          loading={state.requestsLoading}
          error={state.requestsError}
        />
      </section>
    </div>
  );
}
