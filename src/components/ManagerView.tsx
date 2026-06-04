"use client";

import { useStore } from "@/lib/store";
import { ApprovalCard } from "./ApprovalCard";
import pageStyles from "./page.module.css";

export function ManagerView() {
  const { state, handleApproveDeny } = useStore();

  if (state.requestsLoading && state.pendingRequests.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-tertiary)" }}>
        Loading pending requests...
      </div>
    );
  }

  if (state.requestsError && state.pendingRequests.length === 0) {
    return (
      <div
        style={{
          padding: 32,
          background: "var(--color-error-bg)",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
          border: "1px solid #fecaca",
        }}
      >
        <div style={{ fontWeight: 600, color: "var(--color-error-text)", marginBottom: 4 }}>
          Failed to load requests
        </div>
        <div style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
          {state.requestsError}
        </div>
      </div>
    );
  }

  const pending = state.pendingRequests.filter(
    (r) => r.status === "pending"
  );

  if (!state.requestsLoading && pending.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "var(--color-text-tertiary)" }}>
        <h2 className={pageStyles.sectionTitle}>Pending Approvals</h2>
        <p>No pending requests to review.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className={pageStyles.sectionTitle}>
        Pending Approvals
        {pending.length > 0 && (
          <span className={pageStyles.count}>
            ({pending.length} request{pending.length !== 1 ? "s" : ""})
          </span>
        )}
      </h2>

      {state.requestsLoading && (
        <div
          style={{
            color: "var(--color-brand)",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          Refreshing...
        </div>
      )}

      {pending.map((req) => (
        <ApprovalCard
          key={req.id}
          request={req}
          balances={state.balances}
          onAction={handleApproveDeny}
        />
      ))}
    </div>
  );
}
