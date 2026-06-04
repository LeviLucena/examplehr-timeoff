import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RequestForm } from "../components/RequestForm";
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
];

const meta: Meta<typeof RequestForm> = {
  title: "Components/RequestForm",
  component: RequestForm,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof RequestForm>;

export const Default: Story = {
  args: {
    balances: sampleBalances,
    employeeId: "emp-1",
    submitting: false,
    error: null,
    onSubmit: async () => {},
  },
};

export const Submitting: Story = {
  args: {
    balances: sampleBalances,
    employeeId: "emp-1",
    submitting: true,
    error: null,
    onSubmit: async () => {},
  },
};

export const WithError: Story = {
  args: {
    balances: sampleBalances,
    employeeId: "emp-1",
    submitting: false,
    error: "Insufficient balance: requested 20 days but only 15 available.",
    onSubmit: async () => {},
  },
};

export const NoBalances: Story = {
  args: {
    balances: [],
    employeeId: "emp-1",
    submitting: false,
    error: null,
    onSubmit: async () => {},
  },
};
