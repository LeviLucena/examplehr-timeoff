"use client";

import { useStore } from "@/lib/store";
import { EmployeeView } from "@/components/EmployeeView";
import { ManagerView } from "@/components/ManagerView";
import { Notification } from "@/components/Notification";

export default function Home() {
  const { state, switchRole, clearNotification } = useStore();

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            ExampleHR
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            Time-Off Management
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            {state.role === "employee" ? "👤 Employee" : "👔 Manager"}
          </span>
          <button
            onClick={() =>
              switchRole(state.role === "employee" ? "manager" : "employee")
            }
            style={switchButtonStyle}
          >
            Switch to {state.role === "employee" ? "Manager" : "Employee"} View
          </button>
        </div>
      </header>

      <main style={mainStyle}>
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

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
};

const headerStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const mainStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "24px",
};

const switchButtonStyle: React.CSSProperties = {
  padding: "6px 14px",
  backgroundColor: "#f3f4f6",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  color: "#374151",
};
