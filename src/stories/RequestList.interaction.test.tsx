import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { RequestList } from "../components/RequestList";

describe("RequestList", () => {
  it("shows loading state", async () => {
    const screen = await render(
      <RequestList requests={[]} loading={true} error={null} />
    );
    await expect.element(screen.getByTestId("requests-loading")).toBeVisible();
  });

  it("shows empty state", async () => {
    const screen = await render(
      <RequestList requests={[]} loading={false} error={null} />
    );
    await expect.element(screen.getByTestId("requests-empty")).toBeVisible();
  });

  it("shows error state", async () => {
    const screen = await render(
      <RequestList
        requests={[]}
        loading={false}
        error="Failed to load requests"
      />
    );
    await expect.element(screen.getByTestId("requests-error")).toBeVisible();
  });

  it("renders request list with data", async () => {
    const requests = [
      {
        id: "req-1",
        employeeId: "emp-1",
        employeeName: "Alice",
        locationId: "loc-1",
        locationName: "New York",
        daysRequested: 2,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: "req-2",
        employeeId: "emp-2",
        employeeName: "Bob",
        locationId: "loc-2",
        locationName: "London",
        daysRequested: 3,
        status: "approved" as const,
        createdAt: new Date().toISOString(),
      },
    ];
    const screen = await render(
      <RequestList requests={requests} loading={false} error={null} />
    );
    await expect.element(screen.getByTestId("request-list")).toBeVisible();
    await expect.element(screen.getByText("Alice")).toBeVisible();
    await expect.element(screen.getByText("Bob")).toBeVisible();
  });
});
