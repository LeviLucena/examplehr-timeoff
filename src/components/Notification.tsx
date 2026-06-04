"use client";

import { useEffect } from "react";

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onDismiss: () => void;
}

export function Notification({ type, message, onDismiss }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      data-testid="notification"
      style={{
        ...containerStyle,
        backgroundColor: type === "success" ? "#dcfce7" : "#fef2f2",
        borderColor: type === "success" ? "#86efac" : "#fecaca",
        color: type === "success" ? "#166534" : "#991b1b",
      }}
      role="alert"
    >
      <span style={{ fontSize: 14 }}>{message}</span>
      <button
        onClick={onDismiss}
        style={dismissStyle}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: "fixed",
  top: 16,
  right: 16,
  padding: "12px 16px",
  borderRadius: 8,
  border: "1px solid",
  display: "flex",
  alignItems: "center",
  gap: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  zIndex: 1000,
  maxWidth: 400,
};

const dismissStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: 18,
  cursor: "pointer",
  padding: 0,
  lineHeight: 1,
  opacity: 0.6,
  color: "inherit",
};
