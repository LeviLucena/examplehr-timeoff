import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ManagerView } from "../components/ManagerView";
import { StoreProvider } from "../lib/store";
import { type ReactNode } from "react";

const meta: Meta<typeof ManagerView> = {
  title: "Views/ManagerView",
  component: ManagerView,
  decorators: [
    (Story: () => ReactNode) => <StoreProvider><Story /></StoreProvider>,
  ],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ManagerView>;

export const Default: Story = {};
