import type { Meta, StoryObj } from "@storybook/react";
import { SectionHeading } from "@components/modules/SectionHeading";

const meta: Meta<typeof SectionHeading> = {
  title: "Components/Modules/Section Headings",
  component: SectionHeading,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Default: Story = {
  args: {
    heading: "Phasellus luctus ligula tempor",
    headingLevel: 3,
  },
};

export const StrikeThrough: Story = {
  args: {
    heading: "Integer ultricies arcu velit",
    strikeThrough: true,
    headingLevel: 4,
  },
};

export const Blue: Story = {
  args: {
    heading: "Proin hendrerit massa ante",
    headingLevel: 3,
    color: "blue",
  },
};

export const Green: Story = {
  args: {
    heading: "Etiam varius nunc hendrerit",
    headingLevel: 3,
    strikeThrough: true,
    color: "green",
  },
};

export const Purple: Story = {
  args: {
    heading: "Vestibulum at ex sit",
    headingLevel: 3,
    color: "purple",
  },
};

export const Orange: Story = {
  args: {
    heading: "Maecenas eu placerat elit",
    headingLevel: 3,
    color: "orange",
    strikeThrough: true,
  },
};

export const Navy: Story = {
  args: {
    heading: "Vivamus id nunc feugiat",
    headingLevel: 3,
    color: "navy",
  },
};
