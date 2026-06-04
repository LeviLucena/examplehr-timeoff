import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Notification } from "../components/Notification";

const meta: Meta<typeof Notification> = {
  title: "Components/Notification",
  component: Notification,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Success: Story = {
  args: {
    type: "success",
    message: "Time-off request submitted successfully!",
    onDismiss: () => {},
  },
};

export const Error: Story = {
  args: {
    type: "error",
    message: "Insufficient balance. Request could not be processed.",
    onDismiss: () => {},
  },
};
