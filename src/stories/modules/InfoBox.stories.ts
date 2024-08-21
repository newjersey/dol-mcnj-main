import { InfoBox } from "@components/modules/InfoBox";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof InfoBox> = {
  title: "Components/Modules/Info Box",
  component: InfoBox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InfoBox>;

export const Orange: Story = {
  args: {
    copy: "Pellentesque eleifend egestas diam in",
    eyebrow: "In-Demand",
    theme: "orange",
    tooltip: "Hey! I'm a tooltip.",
  },
};

export const Blue: Story = {
  args: {
    number: 39485,
    currency: true,
    eyebrow: "In-Demand",
    theme: "blue",
    tooltip: "Hey! I'm a tooltip.",
  },
};

export const Purple: Story = {
  args: {
    number: 54,
    eyebrow: "Jobs Available",
    theme: "purple",
    link: {
      copy: "Vestibulum rutrum nisl",
      url: "https://www.google.com",
    },
    tooltip:
      "Suspendisse tincidunt, elit sed iaculis imperdiet, quam justo molestie quam, vel sollicitudin.",
  },
};

export const Green: Story = {
  args: {
    eyebrow: "Jobs Available",
    theme: "green",
    copy: "Aliquam sit amet eros",
    link: {
      copy: "Curabitur id risus",
      url: "https://www.google.com",
    },
    tooltip: "Hey! I'm a tooltip.",
  },
};
