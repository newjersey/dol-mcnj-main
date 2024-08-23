import { Fragment, createElement } from "react";
import { LabelBox } from "@components/modules/LabelBox";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof LabelBox> = {
  title: "Components/Modules/Label Box",
  component: LabelBox,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LabelBox>;

const children = createElement(
  Fragment,
  null,
  createElement(
    "p",
    null,
    "Vestibulum lobortis lorem ipsum, eu vulputate sapien mollis vitae. Nam a laoreet odio. Nullam scelerisque, nisi at volutpat ornare, lacus magna fringilla neque, id feugiat mi velit nec augue. Duis id quam tellus. Ut in blandit nisl. Sed eros mi, imperdiet ut luctus ut, efficitur sit amet nunc. Integer rutrum mattis pulvinar. Aliquam fringilla aliquet congue. Etiam vel ante ut tellus ultrices sodales.",
  ),
);

export const Centered: Story = {
  args: {
    title: "Proin venenatis",
    bgFill: true,
    icon: "Tree",
    children,
    centered: true,
  },
};

export const Blue: Story = {
  args: {
    title: "Proin venenatis",
    color: "blue",
    children,
  },
};

export const Purple: Story = {
  args: {
    title: "Praesent sit",
    color: "purple",
    children,
  },
};

export const Green: Story = {
  args: {
    title: "Etiam non",
    color: "green",
    children,
  },
};

export const Navy: Story = {
  args: {
    title: "Aliquam rutrum",
    color: "navy",
    children,
  },
};

export const Orange: Story = {
  args: {
    title: "Curabitur mi",
    color: "orange",
    children,
  },
};

export const WithIcon: Story = {
  args: {
    title: "Curabitur mi",
    color: "blue",
    icon: "Tree",
    children,
  },
};
