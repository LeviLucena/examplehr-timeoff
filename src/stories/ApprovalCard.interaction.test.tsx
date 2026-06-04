import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { ApprovalCard } from "../components/ApprovalCard";

describe("ApprovalCard", () => {
  it("renders pending request with balance info", async () => {
    const request = {
      id: "req-1",
      employeeId: "emp-1",
      employeeName: "Alice Johnson",
      locationId: "loc-1",
      locationName: "New York",
      daysRequested: 3,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };
    const screen = await render(
      <ApprovalCard
        request={request}
        balances={[{ locationId: "loc-1", availableDays: 15 }]}
        onAction={async () => {}}
      />
    );
    await expect.element(
      screen.getByTestId("approval-card-req-1")
    ).toBeVisible();
    await expect.element(screen.getByText("15 days")).toBeVisible();
    await expect.element(screen.getByText("Approve")).toBeVisible();
    await expect.element(screen.getByText("Deny")).toBeVisible();
  });

  it("shows unknown balance when no balance found", async () => {
    const request = {
      id: "req-2",
      employeeId: "emp-2",
      employeeName: "Bob Smith",
      locationId: "loc-unknown",
      locationName: "Unknown",
      daysRequested: 1,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };
    const screen = await render(
      <ApprovalCard
        request={request}
        balances={[]}
        onAction={async () => {}}
      />
    );
    await expect.element(screen.getByText("Unknown")).toBeVisible();
  });
});
