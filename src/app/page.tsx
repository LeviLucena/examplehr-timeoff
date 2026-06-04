"use client";

import { useStore } from "@/lib/store";
import { EmployeeView } from "@/components/EmployeeView";
import { ManagerView } from "@/components/ManagerView";
import { Notification } from "@/components/Notification";
import styles from "@/components/page.module.css";

export default function Home() {
  const { state, switchRole, clearNotification } = useStore();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>EH</div>
          <div className={styles.titleGroup}>
            <h1>ExampleHR</h1>
            <p>Time-Off Management</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.roleBadge}>
            {state.role === "employee" ? "Employee" : "Manager"}
          </span>
          <button
            onClick={() =>
              switchRole(state.role === "employee" ? "manager" : "employee")
            }
            className={styles.switchButton}
          >
            {state.role === "employee" ? "Manager View" : "Employee View"}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {state.role === "employee" ? <EmployeeView /> : <ManagerView />}
      </main>

      {state.notification && (
        <Notification
          type={state.notification.type}
          message={state.notification.message}
          onDismiss={clearNotification}
        />
      )}
    </div>
  );
}
