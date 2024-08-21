import { BetaBanner as BetaBannerItem } from "@components/global/BetaBanner";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BetaBannerItem> = {
  title: "Components/Global",
  component: BetaBannerItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BetaBannerItem>;

export const BetaBanner: Story = {
  args: {},
};
