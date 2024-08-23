import { ResultCard as ResultCardItem } from "@components/modules/ResultCard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ResultCardItem> = {
  title: "Components/Modules",
  component: ResultCardItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ResultCardItem>;

export const ResultCard: Story = {
  args: {
    title: "Phasellus cursus, leo pulvinar hendrerit",
    description:
      "Mauris at luctus lectus. Vestibulum dignissim tempus libero in blandit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quam odio, rutrum in ante sit amet, semper volutpat est. Integer dapibus molestie ante nec rhoncus. Donec eu sapien iaculis nulla viverra fringilla. Nunc a purus sit amet velit sollicitudin finibus vel at purus. Suspendisse placerat diam at luctus blandit. Fusce et ipsum neque. Vestibulum consectetur nisi enim, vitae viverra est euismod vel. Morbi commodo congue purus nec dapibus. Pellentesque tincidunt ut odio vel vestibulum. Suspendisse pulvinar molestie posuere. Morbi iaculis.",
    cipDefinition: {
      cip: "11.0101",
      ciptitle: "Lorem Ipsum",
      cipcode: "9384703",
    },
    location: "Nullam nisi lectus",
    education: "Praesent lacinia ipsum eu mi.",
    timeToComplete: 6,
    percentEmployed: 75,
    cost: 1800,
    inDemandLabel: "In quis commodo mauris, ut sodales",
    url: "https://www.google.com",
    trainingId: "1",
  },
};
