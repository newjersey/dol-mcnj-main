import { Tag } from "@components/modules/Tag";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tag> = {
  title: "Components/Modules/Tag",
  component: Tag,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Blue: Story = {
  args: {
    title: "Aenean molestie",
    color: "blue",
  },
};

export const Green: Story = {
  args: {
    title: "Praesent nisi",
    color: "green",
  },
};

export const Purple: Story = {
  args: {
    title: "Donec pellentesque",
    color: "purple",
  },
};

export const Navy: Story = {
  args: {
    title: "Nunc vel",
    color: "navy",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Sed quis",
    icon: "Tree",
    color: "orange",
    iconWeight: "regular",
  },
};

export const Chip: Story = {
  args: {
    title: "Sed quis",
    icon: "Fire",
    color: "orange",
    iconWeight: "fill",
    chip: true,
  },
};
