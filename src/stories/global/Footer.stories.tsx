import { Footer as FooterItem } from "@components/global/Footer";
import type { Meta, StoryObj } from "@storybook/react";
import { footerNavs } from "stories/mock/footerNavs";

const meta: Meta<typeof FooterItem> = {
  title: "Components/Global",
  component: FooterItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FooterItem>;

export const Footer: Story = {
  args: {
    items: footerNavs,
  },
};
