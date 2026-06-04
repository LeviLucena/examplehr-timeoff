import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BalancesTable } from "../components/BalancesTable";
import type { TimeOffBalance } from "../lib/types";

const sampleBalances: TimeOffBalance[] = [
  {
    employeeId: "emp-1",
    employeeName: "Alice Johnson",
    locationId: "loc-1",
    locationName: "New York",
    totalDays: 20,
    usedDays: 5,
    availableDays: 15,
    accrualDate: "2025-01-15T00:00:00Z",
  },
  {
    employeeId: "emp-1",
    employeeName: "Alice Johnson",
    locationId: "loc-2",
    locationName: "London",
    totalDays: 20,
    usedDays: 8,
    availableDays: 12,
    accrualDate: "2025-03-10T00:00:00Z",
  },
  {
    employeeId: "emp-1",
    employeeName: "Alice Johnson",
    locationId: "loc-3",
    locationName: "Tokyo",
    totalDays: 20,
    usedDays: 2,
    availableDays: 18,
    accrualDate: "2025-06-01T00:00:00Z",
  },
];

const meta: Meta<typeof BalancesTable> = {
  title: "Components/BalancesTable",
  component: BalancesTable,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof BalancesTable>;

export const Loading: Story = {
  args: {
    balances: [],
    loading: true,
    stale: false,
    error: null,
    lastSyncedAt: null,
  },
};

export const Empty: Story = {
  args: {
    balances: [],
    loading: false,
    stale: false,
    error: null,
    lastSyncedAt: null,
  },
};

export const Error: Story = {
  args: {
    balances: [],
    loading: false,
    stale: true,
    error: "Failed to connect to HCM. Please try again.",
    lastSyncedAt: null,
  },
};

export const Live: Story = {
  args: {
    balances: sampleBalances,
    loading: false,
    stale: false,
    error: null,
    lastSyncedAt: new Date().toISOString(),
  },
};

export const Stale: Story = {
  args: {
    balances: sampleBalances,
    loading: false,
    stale: true,
    error: null,
    lastSyncedAt: new Date(Date.now() - 60000).toISOString(),
  },
};

export const Refreshing: Story = {
  args: {
    balances: sampleBalances,
    loading: true,
    stale: false,
    error: null,
    lastSyncedAt: new Date().toISOString(),
  },
};
