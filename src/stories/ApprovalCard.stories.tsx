import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ApprovalCard } from "../components/ApprovalCard";
import type { TimeOffRequest } from "../lib/types";

const sampleRequest: TimeOffRequest = {
  id: "req-1",
  employeeId: "emp-1",
  employeeName: "Alice Johnson",
  locationId: "loc-1",
  locationName: "New York",
  daysRequested: 3,
  status: "pending",
  createdAt: new Date(Date.now() - 86400000).toISOString(),
};

const meta: Meta<typeof ApprovalCard> = {
  title: "Components/ApprovalCard",
  component: ApprovalCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ApprovalCard>;

export const PendingWithBalance: Story = {
  args: {
    request: sampleRequest,
    balances: [{ locationId: "loc-1", availableDays: 15 }],
    onAction: async () => {},
  },
};

export const PendingUnknownBalance: Story = {
  args: {
    request: {
      ...sampleRequest,
      id: "req-2",
      locationId: "loc-unknown",
    },
    balances: [],
    onAction: async () => {},
  },
};
