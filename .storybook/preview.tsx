import type { Preview } from "@storybook/react";
import React from "react";
import "./storybook.css";
import "../src/styles/main.scss";
import DocumentationTemplate from "./DocumentationTemplate.mdx";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      page: DocumentationTemplate,
    },
  },
  decorators: [
    (Story) => (
      <main>
        <Story />
      </main>
    ),
  ],
};

export default preview;
