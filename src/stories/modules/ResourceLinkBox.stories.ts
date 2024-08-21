import { ResourceLinkBox as ResourceLinkBoxItem } from "@components/modules/ResourceLinkBox";
import type { Meta, StoryObj } from "@storybook/react";
import { SectionIcons } from "@utils/types";

const meta: Meta<typeof ResourceLinkBoxItem> = {
  title: "Components/Modules",
  component: ResourceLinkBoxItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ResourceLinkBoxItem>;

export const ResourceLinkBox: Story = {
  args: {
    heading: "Related Resources",
    theme: "navy",
    links: [
      {
        copy: "Tuition Assistance Resources",
        url: "/tution-assistance-resources",
        systemIcon: "supportBold" as SectionIcons,
      },
      {
        copy: "Other Assistance Resources",
        url: "/other-assistance-resources",
        systemIcon: "supportBold" as SectionIcons,
      },
    ],
  },
};
