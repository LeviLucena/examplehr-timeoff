import { describe, it, expect } from "vitest";
import { render } from "vitest-browser-react";
import { RequestForm } from "../components/RequestForm";

describe("RequestForm", () => {
  it("renders form with balances", async () => {
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
      <RequestForm
        balances={balances}
        employeeId="emp-1"
        submitting={false}
        error={null}
        onSubmit={async () => {}}
      />
    );
    await expect.element(screen.getByTestId("request-form")).toBeVisible();
    await expect.element(screen.getByTestId("location-select")).toBeVisible();
    await expect.element(screen.getByTestId("days-input")).toBeVisible();
    await expect.element(screen.getByTestId("submit-button")).toBeVisible();
  });

  it("disables submit button when submitting", async () => {
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
      <RequestForm
        balances={balances}
        employeeId="emp-1"
        submitting={true}
        error={null}
        onSubmit={async () => {}}
      />
    );
    await expect.element(screen.getByTestId("submit-button")).toBeDisabled();
  });

  it("shows error message", async () => {
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
      <RequestForm
        balances={balances}
        employeeId="emp-1"
        submitting={false}
        error="Insufficient balance"
        onSubmit={async () => {}}
      />
    );
    await expect.element(screen.getByTestId("submit-error")).toBeVisible();
    await expect.element(screen.getByText("Insufficient balance")).toBeVisible();
  });

  it("shows no-balances message", async () => {
    const screen = await render(
      <RequestForm
        balances={[]}
        employeeId="emp-1"
        submitting={false}
        error={null}
        onSubmit={async () => {}}
      />
    );
    await expect.element(
      screen.getByTestId("request-form-no-balances")
    ).toBeVisible();
  });
});
