import { Tabs as TabsItem } from "@components/blocks/Tabs";
import type { Meta, StoryObj } from "@storybook/react";
import { tabContent } from "../mock/tabs";
import { TabItemProps } from "@utils/types";

const meta: Meta<typeof TabsItem> = {
  title: "Components/Blocks",
  component: TabsItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TabsItem>;

export const Tabs: Story = {
  args: {
    items: tabContent as TabItemProps[],
  },
};
