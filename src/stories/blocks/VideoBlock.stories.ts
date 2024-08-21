import { VideoBlock as VideoBlockItem } from "@components/blocks/VideoBlock";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof VideoBlockItem> = {
  title: "Components/Blocks",
  component: VideoBlockItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VideoBlockItem>;

export const VideoBlock: Story = {
  args: {
    video: "https://www.youtube.com/embed/FarEy_eoNFE",
  },
};
