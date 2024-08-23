import { IconSelector as IconSelect } from "@components/modules/IconSelector";
import type { Meta, StoryObj } from "@storybook/react";
import { colors } from "@utils/settings";

const meta: Meta<typeof IconSelect> = {
  title: "Components/Modules",
  component: IconSelect,
  tags: ["autodocs"],
  args: {
    name: "Eye",
    size: 140,
    color: colors.primary,
  },
};

export default meta;
type Story = StoryObj<typeof IconSelect>;

export const IconSelector: Story = {
  args: {
    name: "Eye",
    size: 140,
    color: colors.primary,
  },
};
