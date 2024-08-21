import { AccordionItem as Accordion } from "@components/modules/AccordionItem";
import type { Meta, StoryObj } from "@storybook/react";
import { items } from "../mock/accordionItems";

const meta: Meta<typeof Accordion> = {
  title: "Components/Modules",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const AccordionItem: Story = {
  args: {
    keyValue: 1,
    title: items[0].question,
    // @ts-ignore
    content: items[0].answer.json,
  },
};
