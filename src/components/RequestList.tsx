"use client";

import type { TimeOffRequest } from "@/lib/types";

interface RequestListProps {
  requests: TimeOffRequest[];
  loading: boolean;
  error: string | null;
}

export function RequestList({
  requests,
  loading,
  error,
}: RequestListProps) {
  if (loading && requests.length === 0) {
    return (
      <div data-testid="requests-loading" style={loadingStyle}>
        <p>Loading requests...</p>
      </div>
    );
  }

  if (error && requests.length === 0) {
    return (
      <div data-testid="requests-error" style={errorContainerStyle}>
        <p style={{ color: "#ef4444", fontWeight: 600 }}>
          Failed to load requests
        </p>
        <p style={{ color: "#6b7280", fontSize: 14 }}>{error}</p>
      </div>
    );
  }

  if (!loading && requests.length === 0) {
    return (
      <div data-testid="requests-empty" style={emptyStyle}>
        <p>No pending requests.</p>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 8 }}>
          Refreshing...
        </p>
      )}
      <div data-testid="request-list" style={listStyle}>
        {requests.map((req) => (
          <div key={req.id} style={cardStyle}>
            <div style={cardHeaderStyle}>
              <span style={employeeNameStyle}>{req.employeeName}</span>
              <span
                style={{
                  ...badgeStyle,
                  backgroundColor:
                    req.status === "approved"
                      ? "#dcfce7"
                      : req.status === "denied"
                        ? "#fef2f2"
                        : "#fef9c3",
                  color:
                    req.status === "approved"
                      ? "#166534"
                      : req.status === "denied"
                        ? "#991b1b"
                        : "#854d0e",
                }}
              >
                {req.status}
              </span>
            </div>
            <div style={cardBodyStyle}>
              <span>
                {req.locationName} &middot; {req.daysRequested} day
                {req.daysRequested > 1 ? "s" : ""}
              </span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {new Date(req.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 12,
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
};

const employeeNameStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
  color: "#111827",
};

const cardBodyStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 13,
  color: "#6b7280",
};

const badgeStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  padding: "2px 8px",
  borderRadius: 12,
  textTransform: "capitalize",
};

const loadingStyle: React.CSSProperties = {
  padding: 24,
  textAlign: "center",
  color: "#6b7280",
};

const errorContainerStyle: React.CSSProperties = {
  padding: 24,
  backgroundColor: "#fef2f2",
  borderRadius: 8,
  textAlign: "center",
};

const emptyStyle: React.CSSProperties = {
  padding: 24,
  textAlign: "center",
  color: "#6b7280",
};
