import { SystemError as SystemErrorItem } from "@components/modules/SystemError";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SystemErrorItem> = {
  title: "Components/Modules",
  component: SystemErrorItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SystemErrorItem>;

export const SystemError: Story = {
  args: {
    heading: "System Error",
    copy: "<p>Something went wrong. Please try again later.</p><ul><li><a href='/in-demand-occupations'>Link 1</a></li><li><a href='/in-demand-occupations'>Link 2</a></li></ul>",
    color: "green",
  },
};
