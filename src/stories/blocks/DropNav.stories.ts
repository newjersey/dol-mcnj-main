import { DropNav as DropNavItem } from "@components/blocks/DropNav";
import type { Meta, StoryObj } from "@storybook/react";
import { TopicProps } from "@utils/types";
import { dropNavItems } from "stories/mock/dropNavItems";

interface DropNavProps {
  sys: { id: string };
  title: string;
  topics: {
    items: TopicProps[];
  };
}

const meta: Meta<typeof DropNavItem> = {
  title: "Components/Blocks",
  component: DropNavItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DropNavItem>;

export const DropNav: Story = {
  args: {
    items: dropNavItems as DropNavProps[],
    elementId: "drop-nav",
  },
};
