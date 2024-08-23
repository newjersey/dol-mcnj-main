import { OccupationList as OccupationListItem } from "@components/blocks/OccupationList";
import type { Meta, StoryObj } from "@storybook/react";
import { inDemandList } from "stories/mock/inDemandList";

const meta: Meta<typeof OccupationListItem> = {
  title: "Components/Blocks",
  component: OccupationListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OccupationListItem>;

export const OccupationList: Story = {
  args: {
    items: inDemandList,
  },
};
