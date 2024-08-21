import { Breadcrumbs as BreadcrumbsBlock } from "@components/modules/Breadcrumbs";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BreadcrumbsBlock> = {
  title: "Components/Modules",
  component: BreadcrumbsBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BreadcrumbsBlock>;

export const Breadcrumbs: Story = {
  args: {
    crumbs: [
      {
        copy: "Vestibulum ante",
        url: "/",
      },
      {
        copy: "Sed ut",
        url: "/",
      },
    ],
    pageTitle: "Suspendisse varius",
  },
};
