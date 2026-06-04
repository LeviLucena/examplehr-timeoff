"use client";

import type { TimeOffRequest, ApproveDenyPayload } from "@/lib/types";

interface ApprovalCardProps {
  request: TimeOffRequest;
  balances: { locationId: string; availableDays: number }[];
  onAction: (payload: ApproveDenyPayload) => Promise<void>;
}

export function ApprovalCard({
  request,
  balances,
  onAction,
}: ApprovalCardProps) {
  const balance = balances.find((b) => b.locationId === request.locationId);

  const handleApprove = () => {
    onAction({
      requestId: request.id,
      action: "approved",
      reviewerId: "mgr-1",
    });
  };

  const handleDeny = () => {
    onAction({
      requestId: request.id,
      action: "denied",
      reviewerId: "mgr-1",
    });
  };

  return (
    <div
      data-testid={`approval-card-${request.id}`}
      style={cardStyle}
    >
      <div style={headerStyle}>
        <span style={nameStyle}>{request.employeeName}</span>
        <span style={badgeStyle}>pending</span>
      </div>

      <div style={detailStyle}>
        <div style={detailRowStyle}>
          <span style={labelStyle}>Location</span>
          <span>{request.locationName}</span>
        </div>
        <div style={detailRowStyle}>
          <span style={labelStyle}>Days Requested</span>
          <span>{request.daysRequested}</span>
        </div>
        <div style={detailRowStyle}>
          <span style={labelStyle}>Available Balance</span>
          <span style={{ fontWeight: 600 }}>
            {balance?.availableDays ?? "Unknown"} days
          </span>
        </div>
        <div style={detailRowStyle}>
          <span style={labelStyle}>Submitted</span>
          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={actionsStyle}>
        <button
          onClick={handleDeny}
          style={denyButtonStyle}
          data-testid={`deny-${request.id}`}
        >
          Deny
        </button>
        <button
          onClick={handleApprove}
          style={approveButtonStyle}
          data-testid={`approve-${request.id}`}
        >
          Approve
        </button>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const nameStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 15,
  color: "#111827",
};

const badgeStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  padding: "2px 8px",
  borderRadius: 12,
  backgroundColor: "#fef9c3",
  color: "#854d0e",
  textTransform: "capitalize",
};

const detailStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 16,
};

const detailRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 13,
  color: "#374151",
};

const labelStyle: React.CSSProperties = {
  color: "#6b7280",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
};

const denyButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px 16px",
  backgroundColor: "#ffffff",
  color: "#ef4444",
  border: "1px solid #ef4444",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const approveButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px 16px",
  backgroundColor: "#22c55e",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
