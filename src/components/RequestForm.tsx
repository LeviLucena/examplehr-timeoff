"use client";

import { useState } from "react";
import type { TimeOffBalance, SubmitRequestPayload } from "@/lib/types";

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
      <div data-testid="request-form-no-balances" style={noBalanceStyle}>
        No balances available to request time off.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="request-form"
      style={formStyle}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 600 }}>
        Request Time Off
      </h3>

      <div style={fieldStyle}>
        <label style={labelStyle}>Location</label>
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          style={selectStyle}
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
        <div style={infoStyle}>
          Available: <strong>{selectedBalance.availableDays}</strong> days
        </div>
      )}

      <div style={fieldStyle}>
        <label style={labelStyle}>Days Requested</label>
        <input
          type="number"
          min={1}
          max={selectedBalance?.availableDays ?? 1}
          value={daysRequested}
          onChange={(e) => setDaysRequested(Number(e.target.value))}
          style={inputStyle}
          data-testid="days-input"
        />
      </div>

      {error && (
        <div data-testid="submit-error" style={errorStyle}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !locationId || daysRequested < 1}
        style={{
          ...buttonStyle,
          opacity:
            submitting || !locationId || daysRequested < 1 ? 0.5 : 1,
        }}
        data-testid="submit-button"
      >
        {submitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 20,
  maxWidth: 400,
};

const fieldStyle: React.CSSProperties = {
  marginBottom: 12,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 4,
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 14,
  border: "1px solid #d1d5db",
  borderRadius: 6,
  backgroundColor: "#fff",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 14,
  border: "1px solid #d1d5db",
  borderRadius: 6,
  boxSizing: "border-box",
};

const infoStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 12,
};

const errorStyle: React.CSSProperties = {
  backgroundColor: "#fef2f2",
  color: "#ef4444",
  padding: "8px 12px",
  borderRadius: 6,
  fontSize: 13,
  marginBottom: 12,
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 16px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const noBalanceStyle: React.CSSProperties = {
  padding: 24,
  textAlign: "center",
  color: "#6b7280",
  backgroundColor: "#f9fafb",
  borderRadius: 8,
};
