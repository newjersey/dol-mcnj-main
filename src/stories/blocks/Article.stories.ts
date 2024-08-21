import { Article as ArticleItem } from "@components/blocks/Article";
import type { Meta, StoryObj } from "@storybook/react";
import { ContentfulRichTextProps } from "@utils/types";
import { article } from "stories/mock/article";

const meta: Meta<typeof ArticleItem> = {
  title: "Components/Blocks",
  component: ArticleItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ArticleItem>;

export const Article: Story = {
  args: {
    content: article as ContentfulRichTextProps,
  },
};
