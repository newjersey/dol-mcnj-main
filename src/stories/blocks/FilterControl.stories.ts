import {
  FilterControl as FilterControlItem,
  FilterControlProps,
} from "@components/blocks/FilterControl";
import type { Meta, StoryObj } from "@storybook/react";
import { filterControls } from "stories/mock/filterControls";

const meta: Meta<typeof FilterControlItem> = {
  title: "Components/Blocks",
  component: FilterControlItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterControlItem>;

export const FilterControl: Story = {
  args: {
    boxLabel: "Filter Controller",
    groups: filterControls as FilterControlProps["groups"],
  },
};
