"use client";

import type { TimeOffBalance } from "@/lib/types";

interface BalancesTableProps {
  balances: TimeOffBalance[];
  loading: boolean;
  stale: boolean;
  error: string | null;
  lastSyncedAt: string | null;
}

function StatusIndicator({ stale }: { stale: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: stale ? "#f59e0b" : "#22c55e",
        marginRight: 6,
      }}
      title={stale ? "Data may be stale" : "Live"}
    />
  );
}

export function BalancesTable({
  balances,
  loading,
  stale,
  error,
  lastSyncedAt,
}: BalancesTableProps) {
  if (loading && balances.length === 0) {
    return (
      <div data-testid="balances-loading" style={skeletonStyle}>
        <div style={skeletonRowStyle} />
        <div style={skeletonRowStyle} />
        <div style={skeletonRowStyle} />
        <p style={{ color: "#6b7280", marginTop: 8 }}>Loading balances...</p>
      </div>
    );
  }

  if (error && balances.length === 0) {
    return (
      <div data-testid="balances-error" style={errorContainerStyle}>
        <p style={{ color: "#ef4444", fontWeight: 600 }}>Failed to load balances</p>
        <p style={{ color: "#6b7280", fontSize: 14 }}>{error}</p>
      </div>
    );
  }

  if (!loading && balances.length === 0) {
    return (
      <div data-testid="balances-empty" style={emptyContainerStyle}>
        <p>No balances found for your account.</p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <StatusIndicator stale={stale} />
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          {stale
            ? "Data may be stale — reconciling..."
            : lastSyncedAt
              ? `Synced at ${new Date(lastSyncedAt).toLocaleTimeString()}`
              : "Live"}
        </span>
      </div>

      {loading && (
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 8 }}>
          Refreshing...
        </p>
      )}

      <table style={tableStyle} data-testid="balances-table">
        <thead>
          <tr>
            <th style={thStyle}>Location</th>
            <th style={thStyle}>Total Days</th>
            <th style={thStyle}>Used</th>
            <th style={thStyle}>Available</th>
            <th style={thStyle}>Accrual Date</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((b) => (
            <tr key={`${b.employeeId}-${b.locationId}`} style={trStyle}>
              <td style={tdStyle}>{b.locationName}</td>
              <td style={tdStyle}>{b.totalDays}</td>
              <td style={tdStyle}>{b.usedDays}</td>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{b.availableDays}</td>
              <td style={tdStyle}>
                {b.accrualDate
                  ? new Date(b.accrualDate).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 14,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 12px",
  borderBottom: "2px solid #e5e7eb",
  color: "#374151",
  fontWeight: 600,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid #e5e7eb",
  color: "#374151",
};

const trStyle: React.CSSProperties = {
  transition: "background-color 0.15s",
};

const skeletonStyle: React.CSSProperties = {
  padding: 16,
};

const skeletonRowStyle: React.CSSProperties = {
  height: 20,
  backgroundColor: "#f3f4f6",
  borderRadius: 4,
  marginBottom: 8,
};

const errorContainerStyle: React.CSSProperties = {
  padding: 24,
  backgroundColor: "#fef2f2",
  borderRadius: 8,
  textAlign: "center",
};

const emptyContainerStyle: React.CSSProperties = {
  padding: 24,
  textAlign: "center",
  color: "#6b7280",
};
