import { SubFooter as SubFooterItem } from "@components/global/SubFooter";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SubFooterItem> = {
  title: "Components/Global",
  component: SubFooterItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SubFooterItem>;

export const SubFooter: Story = {
  args: {},
};
