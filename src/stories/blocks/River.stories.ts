import { River as RiverItem } from "@components/blocks/River";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RiverItem> = {
  title: "Components/Blocks",
  component: RiverItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RiverItem>;

export const River: Story = {
  args: {
    items: [
      {
        sys: { id: "rsdi2rgyo" },
        heading: "High Potential Career Pathways",
        image: {
          sys: {
            id: "1mlYyWt7tOpa9EAoPbmzvR",
          },
          url: "https://images.ctfassets.net/jbdk7q9c827d/1mlYyWt7tOpa9EAoPbmzvR/342507c4c5495b95fb4f900d3f70c735/Screenshot_2023-06-29_at_3.46.08_PM.png",
          title: "Potential Pathways",
          width: 1385,
          height: 744,
          fileName: "Screenshot 2023-06-29 at 3.46.08 PM.png",
          contentType: "image/png",
        },
        copy: "Our algorithm presents you new career pathways that are informed by the successful transitions other New Jersey workers are making.",
      },
      {
        sys: { id: "4pqdkrsmy" },
        heading: "Take Action Quickly",
        image: {
          sys: {
            id: "3dWCGroualGdb35HvvwQdt",
          },
          url: "https://images.ctfassets.net/jbdk7q9c827d/3dWCGroualGdb35HvvwQdt/37d278ff80f1a9c531c9f85129e0874c/Screenshot_2023-06-29_at_3.46.26_PM.png",
          title: "Taking Action",
          width: 1379,
          height: 746,
          fileName: "Screenshot 2023-06-29 at 3.46.26 PM.png",
          contentType: "image/png",
        },
        copy: "When you’ve decided on a new career, we know you want to get to work quickly. We help you take action by recommending high-value training programs and open jobs to apply to.",
      },
    ],
  },
};
