import type { Meta, StoryObj } from "@storybook/react";
import { IconCard } from "@components/modules/IconCard";
import { IconNames } from "@utils/enums";
import { SectionIcons } from "@utils/types";

const meta: Meta<typeof IconCard> = {
  title: "Components/Modules/Icon Cards",
  component: IconCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof IconCard>;

export const Default: Story = {
  args: {
    copy: "Nulla facilisi. Aliquam erat",
    message:
      "Aliquam erat volutpat. Fusce dapibus at ipsum ut lacinia. Ut lorem orci, fringilla et eros eu, auctor dignissim massa. Cras euismod lectus nec efficitur pretium. Morbi sed bibendum nisl. Aenean",
    theme: "blue",
    url: "https://www.google.com",
    icon: "MapTrifold" as IconNames,
    indicator: "ArrowRight",
  },
};

export const NoLink: Story = {
  args: {
    copy: "Nulla facilisi. Aliquam erat",
    message:
      "Aliquam erat volutpat. Fusce dapibus at ipsum ut lacinia. Ut lorem orci, fringilla et eros eu, auctor dignissim massa. Cras euismod lectus nec efficitur pretium. Morbi sed bibendum nisl. Aenean",
    theme: "purple",
    icon: "MapTrifold" as IconNames,
  },
};

export const NoLinkGreen: Story = {
  args: {
    copy: "Nulla facilisi. Aliquam erat",
    message:
      "Aliquam erat volutpat. Fusce dapibus at ipsum ut lacinia. Ut lorem orci, fringilla et eros eu, auctor dignissim massa. Cras euismod lectus nec efficitur pretium. Morbi sed bibendum nisl. Aenean",
    theme: "green",
    icon: "MapTrifold" as IconNames,
  },
};

export const ColorFill: Story = {
  args: {
    copy: "Curabitur consequat libero purus, vitae porttitor elit congue.",
    message:
      "Duis ac dolor in velit suscipit viverra. Morbi tristique vehicula ultricies. Vestibulum ullamcorper tellus purus, id suscipit mi facilisis id. Proin augue diam, vehicula in felis non, interdum suscipit ex.",
    theme: "blue",
    url: "https://www.google.com",
    icon: "MapTrifold" as IconNames,
    indicator: "ArrowRight",
    fill: true,
  },
};

export const Centered: Story = {
  args: {
    copy: "Quisque sed diam eget magna sodales",
    url: "https://www.google.com",
    systemIcon: "training" as SectionIcons,
    centered: true,
  },
};

export const HoverFill: Story = {
  args: {
    copy: "Praesent convallis",
    url: "https://www.google.com",
    icon: "MapTrifold" as IconNames,
    centered: true,
    hoverFill: true,
  },
};
