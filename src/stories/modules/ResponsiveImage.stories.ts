import { ResponsiveImage as Image } from "@components/modules/ResponsiveImage";
import type { Meta, StoryObj } from "@storybook/react";
import { asset } from "../mock/image";

const meta: Meta<typeof Image> = {
  title: "Components/Modules",
  component: Image,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Image>;

export const ResponsiveImage: Story = {
  args: {
    alt: "",
    height: asset.height,
    width: asset.width,
    src: asset.url,
  },
};
