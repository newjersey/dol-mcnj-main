import { Cta } from "@components/modules/Cta";
import type { Meta, StoryObj } from "@storybook/react";
import { createButtonObject } from "@utils/createButtonObject";

const meta: Meta<typeof Cta> = {
  title: "Components/Modules/Cta",
  component: Cta,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Cta>;

const links = [
  {
    copy: "Aliquam hendrerit",
    url: "#",
  },
  {
    copy: "Suspendisse justo eros",
    url: "#",
  },
];

const defaulLinks = links.map((link) => {
  return createButtonObject(link);
});

export const Default: Story = {
  args: {
    theme: "green",
    links: defaulLinks,
  },
};

export const WithHeading: Story = {
  args: {
    heading: "Vestibulum eget",
    theme: "blue",
    links: defaulLinks,
  },
};

export const ButtonRow: Story = {
  args: {
    heading: "Vestibulum eget",
    linkDirection: "row",
    links: defaulLinks,
  },
};
