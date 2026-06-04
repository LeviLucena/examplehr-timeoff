import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { BalancesTable } from "../components/BalancesTable";

describe("BalancesTable", () => {
  it("shows loading skeleton when loading with no data", async () => {
    const screen = await render(
      <BalancesTable
        balances={[]}
        loading={true}
        stale={false}
        error={null}
        lastSyncedAt={null}
      />
    );
    await expect.element(screen.getByTestId("balances-loading")).toBeVisible();
  });

  it("shows error state when error with no data", async () => {
    const screen = await render(
      <BalancesTable
        balances={[]}
        loading={false}
        stale={true}
        error="HCM unavailable"
        lastSyncedAt={null}
      />
    );
    await expect.element(screen.getByTestId("balances-error")).toBeVisible();
  });

  it("shows empty state when no balances", async () => {
    const screen = await render(
      <BalancesTable
        balances={[]}
        loading={false}
        stale={false}
        error={null}
        lastSyncedAt={null}
      />
    );
    await expect.element(screen.getByTestId("balances-empty")).toBeVisible();
  });

  it("renders balances table with data", async () => {
    const balances = [
      {
        employeeId: "emp-1",
        employeeName: "Alice",
        locationId: "loc-1",
        locationName: "New York",
        totalDays: 20,
        usedDays: 5,
        availableDays: 15,
        accrualDate: "2025-01-15T00:00:00Z",
      },
    ];
    const screen = await render(
      <BalancesTable
        balances={balances}
        loading={false}
        stale={false}
        error={null}
        lastSyncedAt={new Date().toISOString()}
      />
    );
    await expect.element(screen.getByTestId("balances-table")).toBeVisible();
    await expect.element(screen.getByText("New York")).toBeVisible();
    await expect.element(screen.getByText("15")).toBeVisible();
  });

  it("shows refreshing indicator when loading with data", async () => {
    const balances = [
      {
        employeeId: "emp-1",
        employeeName: "Alice",
        locationId: "loc-1",
        locationName: "New York",
        totalDays: 20,
        usedDays: 5,
        availableDays: 15,
      },
    ];
    const screen = await render(
      <BalancesTable
        balances={balances}
        loading={true}
        stale={false}
        error={null}
        lastSyncedAt={new Date().toISOString()}
      />
    );
    await expect.element(screen.getByText("Refreshing...")).toBeVisible();
  });
});
