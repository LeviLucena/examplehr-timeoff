"use client";

import { useEffect } from "react";
import styles from "./Notification.module.css";

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
      className={`${styles.container} ${type === "success" ? styles.containerSuccess : styles.containerError}`}
      role="alert"
    >
      <span className={styles.icon}>
        {type === "success" ? "\u2713" : "\u2717"}
      </span>
      <span className={styles.message}>{message}</span>
      <button
        onClick={onDismiss}
        className={styles.dismiss}
        aria-label="Dismiss"
      >
        \u00d7
      </button>
    </div>
  );
}
