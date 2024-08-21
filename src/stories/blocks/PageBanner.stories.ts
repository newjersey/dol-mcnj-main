import { infoBanner } from "./../mock/infoBanner";
import { PageBanner } from "@components/blocks/PageBanner";
import type { Meta, StoryObj } from "@storybook/react";
import { dataBanner } from "stories/mock/dataBanner";
import { pageBanner } from "stories/mock/pageBanner";

const meta: Meta<typeof PageBanner> = {
  title: "Components/Blocks/Page Banner",
  component: PageBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageBanner>;

export const Default: Story = {
  // @ts-ignore
  args: { ...pageBanner, theme: "green" },
};

export const DataBanner: Story = {
  // @ts-ignore
  args: { ...dataBanner, theme: "blue" },
};

export const InfoBoxesBanner: Story = {
  // @ts-ignore
  args: { ...infoBanner, theme: "blue" },
};
