import { CostTable as CostTableItem } from "@components/modules/CostTable";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof CostTableItem> = {
  title: "Components/Modules",
  component: CostTableItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CostTableItem>;

export const CostTable: Story = {
  args: {
    items: [
      {
        title: "Sed tempus",
        cost: 1843,
      },
      {
        title: "Maecenas ante",
        cost: 582,
      },
      {
        title: "Nulla sed",
        cost: 944,
      },
      {
        title: "Donec",
        cost: 4982,
      },
    ],
  },
};
