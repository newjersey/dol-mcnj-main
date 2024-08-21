import { ErrorBox as ErrorBoxItem } from "@components/modules/ErrorBox";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ErrorBoxItem> = {
  title: "Components/Modules",
  component: ErrorBoxItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ErrorBoxItem>;

export const ErrorBox: Story = {
  args: {
    heading: "No results found",
    copy: "We couldn’t find any entries with that tag. Please try again.",
  },
};
