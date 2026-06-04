"use client";

import { useStore } from "@/lib/store";
import { BalancesTable } from "./BalancesTable";
import { RequestForm } from "./RequestForm";
import { RequestList } from "./RequestList";
import pageStyles from "./page.module.css";

export function EmployeeView() {
  const { state, submitTimeOff } = useStore();

  return (
    <div>
      <section className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Your Balances</h2>
        <BalancesTable
          balances={state.balances}
          loading={state.balancesLoading}
          stale={state.balancesStale}
          error={state.balancesError}
          lastSyncedAt={state.lastSyncedAt}
        />
      </section>

      <section className={pageStyles.section}>
        <RequestForm
          balances={state.balances}
          employeeId={state.currentEmployeeId}
          submitting={state.submitting}
          error={state.submitError}
          onSubmit={submitTimeOff}
        />
      </section>

      <section className={pageStyles.section}>
        <h2 className={pageStyles.sectionTitle}>Your Requests</h2>
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
