import { Header as HeaderItem } from "@components/global/Header";
import type { Meta, StoryObj } from "@storybook/react";
import { globalNavItems } from "stories/mock/globalNavItems";
import { mainNavItems } from "stories/mock/mainNavItems";

const meta: Meta<typeof HeaderItem> = {
  title: "Components/Global",
  component: HeaderItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HeaderItem>;

export const Header: Story = {
  args: {
    mainNav: mainNavItems,
    globalNav: globalNavItems,
  },
};
