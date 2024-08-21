import { FancyBanner as FancyBannerItem } from "@components/blocks/FancyBanner";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FancyBannerItem> = {
  title: "Components/Blocks",
  component: FancyBannerItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FancyBannerItem>;

export const FancyBanner: Story = {
  args: {
    image: {
      sys: {
        id: "JAzMHNRnrmPy5KfO7l3PZ",
      },
      url: "https://images.ctfassets.net/jbdk7q9c827d/JAzMHNRnrmPy5KfO7l3PZ/7e94ca8288357ed1bcac7664b1dcd985/NJCC_Hero_Image.png",
      title: "Home Page Banner Image",
      width: 1000,
      height: 695,
      fileName: "NJCC_Hero_Image.png",
      contentType: "image/png",
    },
    title: "Explore NJ Career Central",
    buttonCopy: "Get Started",
  },
};
