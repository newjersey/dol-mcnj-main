import { SeeMoreList as SeeMoreListItem } from "@components/modules/SeeMoreList";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SeeMoreListItem> = {
  title: "Components/Modules",
  component: SeeMoreListItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SeeMoreListItem>;

export const SeeMoreList: Story = {
  args: {
    title: "See More List",
    items: [
      {
        copy: "Donec dictum tempor est, ac mollis",
        url: "htpps://google.com",
      },
      {
        copy: "Nunc et ultrices mauris, ac tincidunt libero",
        url: "htpps://google.com",
      },
      {
        copy: "Sed vitae nunc vitae nunc",
        url: "htpps://google.com",
      },
      {
        copy: "Fusce non magna vitae elit semper suscipit",
        url: "htpps://google.com",
      },
      {
        copy: "Donec finibus, lacus at hendrerit tincidunt, dolor odio",
        url: "htpps://google.com",
      },
      {
        copy: "Vivamus non turpis vel felis",
      },
      {
        copy: "Donec dictum tempor est, ac mollis",
      },
      {
        copy: "Nunc et ultrices mauris, ac tincidunt libero",
        url: "htpps://google.com",
      },
      {
        copy: "Sed vitae nunc vitae nunc",
      },
      {
        copy: "Fusce non magna vitae elit semper suscipit",
        url: "htpps://google.com",
      },
      {
        copy: "Donec finibus, lacus at hendrerit tincidunt, dolor odio",
      },
      {
        copy: "Vivamus non turpis vel felis",
      },
      {
        copy: "Donec dictum tempor est, ac mollis",
      },
      {
        copy: "Nunc et ultrices mauris, ac tincidunt libero",
        url: "htpps://google.com",
      },
      {
        copy: "Sed vitae nunc vitae nunc",
      },
      {
        copy: "Fusce non magna vitae elit semper suscipit",
        url: "htpps://google.com",
      },
      {
        copy: "Donec finibus, lacus at hendrerit tincidunt, dolor odio",
      },
      {
        copy: "Vivamus non turpis vel felis",
      },
      {
        copy: "Donec dictum tempor est, ac mollis",
      },
      {
        copy: "Nunc et ultrices mauris, ac tincidunt libero",
        url: "htpps://google.com",
      },
      {
        copy: "Sed vitae nunc vitae nunc",
      },
      {
        copy: "Fusce non magna vitae elit semper suscipit",
        url: "htpps://google.com",
      },
      {
        copy: "Donec finibus, lacus at hendrerit tincidunt, dolor odio",
      },
      {
        copy: "Vivamus non turpis vel felis",
      },
    ],
  },
};
