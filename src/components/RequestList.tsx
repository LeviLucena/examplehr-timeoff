"use client";

import type { TimeOffRequest } from "@/lib/types";
import styles from "./RequestList.module.css";

interface RequestListProps {
  requests: TimeOffRequest[];
  loading: boolean;
  error: string | null;
}

const statusBadge: Record<string, string> = {
  pending: styles.badgePending,
  approved: styles.badgeApproved,
  denied: styles.badgeDenied,
};

export function RequestList({
  requests,
  loading,
  error,
}: RequestListProps) {
  if (loading && requests.length === 0) {
    return (
      <div data-testid="requests-loading" className={styles.loadingContainer}>
        Loading requests...
      </div>
    );
  }

  if (error && requests.length === 0) {
    return (
      <div data-testid="requests-error" className={styles.errorContainer}>
        <div className={styles.errorTitle}>Failed to load requests</div>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (!loading && requests.length === 0) {
    return (
      <div data-testid="requests-empty" className={styles.emptyContainer}>
        No pending requests.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {loading && (
        <div className={styles.refreshing}>Refreshing...</div>
      )}
      <div data-testid="request-list" className={styles.list}>
        {requests.map((req) => (
          <div key={req.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.employeeName}>{req.employeeName}</span>
              <span className={`${styles.badge} ${statusBadge[req.status] || ""}`}>
                {req.status}
              </span>
            </div>
            <div className={styles.cardBody}>
              <span>
                {req.locationName} &middot; {req.daysRequested} day
                {req.daysRequested > 1 ? "s" : ""}
              </span>
              <span className={styles.date}>
                {new Date(req.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
