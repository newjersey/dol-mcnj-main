import { CardSlider as CardSliderItem } from "@components/blocks/CardSlider";
import type { Meta, StoryObj } from "@storybook/react";
import { CardSliderProps } from "@utils/types";
import { mockCardSlider } from "stories/mock/mockCardSlider";

const meta: Meta<typeof CardSliderItem> = {
  title: "Components/Blocks",
  component: CardSliderItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CardSliderItem>;

export const CardSlider: Story = {
  args: mockCardSlider as CardSliderProps,
};
