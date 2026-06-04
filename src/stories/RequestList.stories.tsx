import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RequestList } from "../components/RequestList";
import type { TimeOffRequest } from "../lib/types";

const sampleRequests: TimeOffRequest[] = [
  {
    id: "req-1",
    employeeId: "emp-1",
    employeeName: "Alice Johnson",
    locationId: "loc-1",
    locationName: "New York",
    daysRequested: 2,
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "req-2",
    employeeId: "emp-2",
    employeeName: "Bob Smith",
    locationId: "loc-2",
    locationName: "London",
    daysRequested: 3,
    status: "pending",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "req-3",
    employeeId: "emp-1",
    employeeName: "Alice Johnson",
    locationId: "loc-3",
    locationName: "Tokyo",
    daysRequested: 1,
    status: "approved",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const meta: Meta<typeof RequestList> = {
  title: "Components/RequestList",
  component: RequestList,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof RequestList>;

export const Loading: Story = {
  args: {
    requests: [],
    loading: true,
    error: null,
  },
};

export const Empty: Story = {
  args: {
    requests: [],
    loading: false,
    error: null,
  },
};

export const Error: Story = {
  args: {
    requests: [],
    loading: false,
    error: "Failed to load requests. Please refresh.",
  },
};

export const Populated: Story = {
  args: {
    requests: sampleRequests,
    loading: false,
    error: null,
  },
};

export const Refreshing: Story = {
  args: {
    requests: sampleRequests,
    loading: true,
    error: null,
  },
};
