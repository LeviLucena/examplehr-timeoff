"use client";

import type { TimeOffBalance } from "@/lib/types";
import styles from "./BalancesTable.module.css";

interface BalancesTableProps {
  balances: TimeOffBalance[];
  loading: boolean;
  stale: boolean;
  error: string | null;
  lastSyncedAt: string | null;
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
      <div data-testid="balances-loading" className={styles.loadingContainer}>
        <div className={styles.skeletonRow}>
          <div className={styles.skeletonCell} />
          <div className={styles.skeletonCell} />
          <div className={styles.skeletonCell} />
          <div className={styles.skeletonCell} />
        </div>
        <div className={styles.skeletonRow}>
          <div className={styles.skeletonCell} />
          <div className={styles.skeletonCell} />
          <div className={styles.skeletonCell} />
          <div className={styles.skeletonCell} />
        </div>
        <div className={styles.skeletonRow}>
          <div className={styles.skeletonCell} />
          <div className={styles.skeletonCell} />
          <div className={styles.skeletonCell} />
          <div className={styles.skeletonCell} />
        </div>
        <div className={styles.skeletonText}>Loading balances...</div>
      </div>
    );
  }

  if (error && balances.length === 0) {
    return (
      <div data-testid="balances-error" className={styles.errorContainer}>
        <div className={styles.errorTitle}>Failed to load balances</div>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  if (!loading && balances.length === 0) {
    return (
      <div data-testid="balances-empty" className={styles.emptyContainer}>
        No balances found for your account.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span
          className={`${styles.indicator} ${stale ? styles.indicatorStale : styles.indicatorLive}`}
        />
        <span className={styles.syncStatus}>
          {stale
            ? "Data may be stale — reconciling..."
            : lastSyncedAt
              ? `Synced at ${new Date(lastSyncedAt).toLocaleTimeString()}`
              : "Live"}
        </span>
      </div>

      {loading && (
        <div className={styles.refreshing}>
          <span>Refreshing...</span>
        </div>
      )}

      <table className={styles.table} data-testid="balances-table">
        <thead>
          <tr>
            <th className={styles.th}>Location</th>
            <th className={styles.th}>Total Days</th>
            <th className={styles.th}>Used</th>
            <th className={styles.th}>Available</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((b) => (
            <tr key={`${b.employeeId}-${b.locationId}`} className={styles.tr}>
              <td className={styles.td}>{b.locationName}</td>
              <td className={styles.td}>{b.totalDays}</td>
              <td className={styles.td}>{b.usedDays}</td>
              <td className={`${styles.td} ${styles.availableCell}`}>
                {b.availableDays}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
