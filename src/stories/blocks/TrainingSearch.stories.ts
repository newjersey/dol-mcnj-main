import { TrainingSearch as TrainingSearchItem } from "@components/blocks/TrainingSearch";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TrainingSearchItem> = {
  title: "Components/Blocks",
  component: TrainingSearchItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TrainingSearchItem>;

export const TrainingSearch: Story = {
  args: {},
};
