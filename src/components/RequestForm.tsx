"use client";

import { useState } from "react";
import type { TimeOffBalance, SubmitRequestPayload } from "@/lib/types";
import styles from "./RequestForm.module.css";

interface RequestFormProps {
  balances: TimeOffBalance[];
  employeeId: string;
  submitting: boolean;
  error: string | null;
  onSubmit: (payload: SubmitRequestPayload) => Promise<void>;
}

export function RequestForm({
  balances,
  employeeId,
  submitting,
  error,
  onSubmit,
}: RequestFormProps) {
  const [locationId, setLocationId] = useState(
    balances.length > 0 ? balances[0].locationId : ""
  );
  const [daysRequested, setDaysRequested] = useState(1);

  const selectedBalance = balances.find((b) => b.locationId === locationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationId || daysRequested < 1) return;
    await onSubmit({
      employeeId,
      locationId,
      daysRequested,
    });
  };

  if (balances.length === 0) {
    return (
      <div data-testid="request-form-no-balances" className={styles.noBalances}>
        No balances available to request time off.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="request-form"
      className={styles.form}
    >
      <div className={styles.title}>Request Time Off</div>

      <div className={styles.field}>
        <label className={styles.label}>Location</label>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className={styles.select}
          data-testid="location-select"
        >
          {balances.map((b) => (
            <option key={b.locationId} value={b.locationId}>
              {b.locationName} ({b.availableDays} days available)
            </option>
          ))}
        </select>
      </div>

      {selectedBalance && (
        <div className={styles.balanceInfo}>
          Available: <strong>{selectedBalance.availableDays}</strong> days
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>Days Requested</label>
        <input
          type="number"
          min={1}
          max={selectedBalance?.availableDays ?? 1}
          value={daysRequested}
          onChange={(e) => setDaysRequested(Number(e.target.value))}
          className={styles.input}
          data-testid="days-input"
        />
      </div>

      {error && (
        <div data-testid="submit-error" className={styles.error}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !locationId || daysRequested < 1}
        className={styles.button}
        data-testid="submit-button"
      >
        {submitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}
