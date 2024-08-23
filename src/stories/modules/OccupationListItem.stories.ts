import { OccupationListItem as OccupationListItemItem } from "@components/modules/OccupationListItem";
import type { Meta, StoryObj } from "@storybook/react";
import { inDemandList } from "stories/mock/inDemandList";

const meta: Meta<typeof OccupationListItemItem> = {
  title: "Components/Modules",
  component: OccupationListItemItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OccupationListItemItem>;

export const OccupationListItem: Story = {
  args: {
    title: Object.keys(inDemandList)[1],
    items:
      inDemandList[
        `${Object.keys(inDemandList)[1]}` as keyof typeof inDemandList
      ],
  },
};
