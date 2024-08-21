import {
  Accordion as AccordionBlock,
  AccordionProps,
} from "@components/blocks/Accordion";
import type { Meta, StoryObj } from "@storybook/react";
import { items } from "../mock/accordionItems";

const meta: Meta<typeof AccordionBlock> = {
  title: "Components/Blocks",
  component: AccordionBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AccordionBlock>;

export const Accordion: Story = {
  args: {
    items: items as AccordionProps["items"],
  },
};
