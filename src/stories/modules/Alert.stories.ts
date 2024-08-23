import { Alert as AlertItem } from "@components/modules/Alert";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AlertItem> = {
  title: "Components/Modules/Alert",
  component: AlertItem,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AlertItem>;

export const Info: Story = {
  args: {
    heading: "Ut vitae",
    copy: "Quisque ultrices mollis mauris, scelerisque scelerisque ex viverra vel. Nulla fringilla tortor metus, in sagittis nulla lacinia et. Maecenas sollicitudin.",
    type: "info",
  },
};

export const Success: Story = {
  args: {
    heading: "Curabitur est",
    copy: "Etiam nec volutpat est. Integer sodales elit erat, nec tincidunt nibh venenatis quis.",
    type: "success",
  },
};

export const Warning: Story = {
  args: {
    heading: "Ut auctor",
    copy: "Vestibulum at malesuada felis. Pellentesque tempus, nisi quis consectetur venenatis, erat nisl rutrum orci, nec dignissim augue orci nec augue.",
    type: "warning",
  },
};

export const Error: Story = {
  args: {
    heading: "Error",
    copy: "Phasellus quis nisl malesuada odio tempus bibendum. Maecenas sodales at enim tincidunt finibus.",
    type: "error",
  },
};

export const NoIcon: Story = {
  args: {
    heading: "Sed iaculis",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "info",
    noIcon: true,
  },
};

export const Slim: Story = {
  args: {
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    type: "info",
    noIcon: true,
    slim: true,
  },
};
