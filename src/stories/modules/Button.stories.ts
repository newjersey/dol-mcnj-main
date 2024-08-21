import { Button } from "@components/modules/Button";
import type { Meta, StoryObj } from "@storybook/react";
import { colors } from "@utils/settings";

const meta: Meta<typeof Button> = {
  title: "Components/Modules/Buttons",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: "Praesent posuere eros",
  },
};

export const Secondary: Story = {
  args: {
    label: "Nam nec tempor",
    defaultStyle: "secondary",
  },
};

export const SecondaryOutline: Story = {
  args: {
    label: "Nam nec tempor",
    defaultStyle: "secondary",
    outlined: true,
  },
};

export const Tertiary: Story = {
  args: {
    label: "Nam nec tempor",
    defaultStyle: "tertiary",
  },
};

export const TertiaryOutline: Story = {
  args: {
    label: "Nam nec tempor",
    defaultStyle: "tertiary",
    outlined: true,
  },
};

export const Quaternary: Story = {
  args: {
    label: "Nam nec tempor",
    defaultStyle: "quaternary",
  },
};

export const QuaternaryOutline: Story = {
  args: {
    label: "Nam nec tempor",
    defaultStyle: "quaternary",
    outlined: true,
  },
};

export const Quinary: Story = {
  args: {
    label: "Nam nec tempor",
    defaultStyle: "quinary",
  },
};

export const QuinaryOutline: Story = {
  args: {
    label: "Nam nec tempor",
    defaultStyle: "quinary",
    outlined: true,
  },
};

export const IconPrefix: Story = {
  args: {
    label: "Curabitur hendrerit euismod",
    className: "usa-button--secondary",
    iconPrefix: "MapTrifold",
  },
};

export const IconSuffix: Story = {
  args: {
    label: "Mauris ac iaculi",
    iconSuffix: "ArrowRight",
  },
};

export const HighlightOrange: Story = {
  args: {
    label: "Donec malesuada nunc",
    highlight: "orange",
    iconPrefix: "Fire",
  },
};

export const HighlightPurple: Story = {
  args: {
    label: "Vivamus non urna",
    highlight: "purple",
    iconSuffix: "HourglassSimpleLow",
  },
};

export const HighlightBlue: Story = {
  args: {
    label: "Nulla semper, felis",
    highlight: "blue",
    iconPrefix: "MapTrifold",
  },
};

export const HighlightGreen: Story = {
  args: {
    label: "Vestibulum eleifend elit",
    highlight: "green",
    iconPrefix: "Tree",
    iconSuffix: "Activity",
  },
};

export const HighlightNavy: Story = {
  args: {
    label: "Vestibulum eleifend elit",
    highlight: "navy",
    iconPrefix: "Tree",
    iconSuffix: "Activity",
  },
};

export const CustomColors: Story = {
  args: {
    label: "Phasellus fringilla est",
    customBgColor: colors.secondaryLight,
    customTextColor: "#000",
    iconPrefix: "Tree",
    iconSuffix: "Activity",
  },
};

export const TagButton: Story = {
  args: {
    label: "Fusce lacus turpis luctus nec",
    tag: true,
    iconPrefix: "Info",
  },
};

export const InfoButton: Story = {
  args: {
    label: "Phasellus fringilla est",
    info: true,
    svgName: "SupportBold",
  },
};

export const InfoFillButton: Story = {
  args: {
    type: "link",
    link: "https://www.google.com",
    label: "Vestibulum risus magna",
    svgName: "Info",
    info: true,
    svgFill: true,
  },
};
