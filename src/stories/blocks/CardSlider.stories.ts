import { CardSlider as CardSliderItem } from "@components/blocks/CardSlider";
import type { Meta, StoryObj } from "@storybook/react";
import { CardSliderProps } from "@utils/types";
import { mockCardSlider } from "stories/mock/mockCardSlider";

const meta: Meta<typeof CardSliderItem> = {
  title: "Components/Blocks/Card Slider",
  component: CardSliderItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CardSliderItem>;

export const Default: Story = {
  args: mockCardSlider as CardSliderProps,
};

export const CardSlider2: Story = {
  args: {
    ...mockCardSlider,
    theme: "purple",
    sectionId: "explore",
  } as CardSliderProps,
};

export const CardSlider3: Story = {
  args: {
    ...mockCardSlider,
    theme: "green",
    sectionId: "training",
  } as CardSliderProps,
};

export const CardSlider4: Story = {
  args: {
    ...mockCardSlider,
    theme: "navy",
  } as CardSliderProps,
};
