import { NjHeader as NjHeaderItem } from "@components/global/NjHeader";
import type { Meta, StoryObj } from "@storybook/react";
import { globalNavItems } from "stories/mock/globalNavItems";

const meta: Meta<typeof NjHeaderItem> = {
  title: "Components/Global",
  component: NjHeaderItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NjHeaderItem>;

export const NjHeader: Story = {
  args: {
    menu: globalNavItems,
  },
};
