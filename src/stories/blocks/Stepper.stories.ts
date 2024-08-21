import { Stepper } from "@components/blocks/Stepper";
import type { Meta, StoryObj } from "@storybook/react";
import { steps } from "stories/mock/steps";

const meta: Meta<typeof Stepper> = {
  title: "Components/Blocks/Stepper",
  component: Stepper,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Green: Story = {
  args: {
    theme: "green",
    // @ts-ignore
    steps,
  },
};

export const Blue: Story = {
  args: {
    theme: "blue",
    // @ts-ignore
    steps,
  },
};

export const Purple: Story = {
  args: {
    theme: "purple",
    // @ts-ignore
    steps,
  },
};

export const Navy: Story = {
  args: {
    theme: "navy",
    // @ts-ignore
    steps,
  },
};
