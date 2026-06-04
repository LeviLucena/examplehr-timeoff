"use client";

import type { TimeOffRequest, ApproveDenyPayload } from "@/lib/types";
import styles from "./ApprovalCard.module.css";

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

  const balanceValue = balance
    ? `${balance.availableDays} days`
    : "Unknown";

  return (
    <div
      data-testid={`approval-card-${request.id}`}
      className={styles.card}
    >
      <div className={styles.header}>
        <span className={styles.name}>{request.employeeName}</span>
        <span className={styles.badge}>pending</span>
      </div>

      <div className={styles.details}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Location</span>
          <span className={styles.detailValue}>{request.locationName}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Days Requested</span>
          <span className={styles.detailValue}>{request.daysRequested}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Available Balance</span>
          <span
            className={`${styles.detailValue} ${balance ? styles.detailValueBrand : styles.detailValueUnknown}`}
          >
            {balanceValue}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Submitted</span>
          <span className={styles.detailValue}>
            {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleDeny}
          className={styles.denyButton}
          data-testid={`deny-${request.id}`}
        >
          Deny
        </button>
        <button
          onClick={handleApprove}
          className={styles.approveButton}
          data-testid={`approve-${request.id}`}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
