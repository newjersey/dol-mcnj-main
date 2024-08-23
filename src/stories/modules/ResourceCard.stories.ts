import { ResourceCard as ResourceCardItem } from "@components/modules/ResourceCard";
import type { Meta, StoryObj } from "@storybook/react";
import { resourceCardItem } from "../mock/resourceCardItem";

const meta: Meta<typeof ResourceCardItem> = {
  title: "Components/Modules/Resource Card",
  component: ResourceCardItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ResourceCardItem>;

export const Blue: Story = {
  args: { ...resourceCardItem, theme: "blue" },
};

export const Green: Story = {
  args: { ...resourceCardItem, theme: "green" },
};

export const Purple: Story = {
  args: { ...resourceCardItem, theme: "purple" },
};

export const Navy: Story = {
  args: { ...resourceCardItem, theme: "navy" },
};
