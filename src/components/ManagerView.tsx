"use client";

import { useStore } from "@/lib/store";
import { ApprovalCard } from "./ApprovalCard";

export function ManagerView() {
  const { state, handleApproveDeny } = useStore();

  if (state.requestsLoading && state.pendingRequests.length === 0) {
    return (
      <div data-testid="manager-loading" style={loadingStyle}>
        <p>Loading pending requests...</p>
      </div>
    );
  }

  if (state.requestsError && state.pendingRequests.length === 0) {
    return (
      <div data-testid="manager-error" style={errorStyle}>
        <p style={{ color: "#ef4444", fontWeight: 600 }}>
          Failed to load requests
        </p>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          {state.requestsError}
        </p>
      </div>
    );
  }

  const pending = state.pendingRequests.filter(
    (r) => r.status === "pending"
  );

  if (!state.requestsLoading && pending.length === 0) {
    return (
      <div data-testid="manager-empty" style={emptyStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Pending Approvals
        </h2>
        <p>No pending requests to review.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
        Pending Approvals
        {pending.length > 0 && (
          <span
            style={{
              marginLeft: 8,
              fontSize: 13,
              color: "#6b7280",
              fontWeight: 400,
            }}
          >
            ({pending.length} request{pending.length !== 1 ? "s" : ""})
          </span>
        )}
      </h2>

      {state.requestsLoading && (
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 8 }}>
          Refreshing...
        </p>
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

const loadingStyle: React.CSSProperties = {
  padding: 48,
  textAlign: "center",
  color: "#6b7280",
};

const errorStyle: React.CSSProperties = {
  padding: 48,
  textAlign: "center",
};

const emptyStyle: React.CSSProperties = {
  padding: 48,
  textAlign: "center",
  color: "#6b7280",
};
