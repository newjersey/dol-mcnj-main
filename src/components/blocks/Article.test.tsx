import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Article } from "./Article";
import { ContentfulRichTextProps } from "../../utils/types";

// Mocking components
jest.mock("../modules/ContentfulRichText", () => ({
  ContentfulRichText: ({ document, assets }: any) => (
    <div data-testid="rich-text">{JSON.stringify(document)}</div>
  ),
}));

jest.mock("../modules/Spinner", () => ({
  Spinner: ({ size, color }: any) => (
    <div
      data-testid="spinner"
      style={{ width: size, height: size, backgroundColor: color }}
    />
  ),
}));

jest.mock("../../utils/slugify", () => ({
  slugify: (str: string) => (str ? str.toLowerCase().replace(/\s/g, "-") : ""),
}));

jest.mock("../../utils/parseHeadingsToNestedArray", () => ({
  parseHeadingsToNestedArray: () => [
    { title: "Heading 1", elementId: "heading-1", items: [] },
    { title: "Heading 2", elementId: "heading-2", items: [] },
  ],
}));

beforeEach(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

describe("Article Component", () => {
  const content: ContentfulRichTextProps = {
    json: { content: "Test Content" },
    links: [],
  } as any;

  it("renders without crashing", () => {
    const { container } = render(<Article content={content} />);
    expect(container).toBeInTheDocument();
  });

  it("renders ContentfulRichText component with correct props", () => {
    const { getByTestId } = render(<Article content={content} />);
    const richText = getByTestId("rich-text");
    expect(richText).toHaveTextContent(JSON.stringify(content.json));
  });

  it("sets heading IDs correctly", () => {
    document.body.innerHTML = `
      <div id="contentBody">
        <h2>Heading 1</h2>
        <h3>Heading 2</h3>
      </div>
    `;
    render(<Article content={content} />);
    const heading1 = document.getElementById("heading-1");
    const heading2 = document.getElementById("heading-2");
    expect(heading1).toBeInTheDocument();
    expect(heading2).toBeInTheDocument();
  });

  it("renders table of contents correctly", () => {
    render(<Article content={content} />);
    const toc = screen.getByRole("navigation");
    expect(toc).toBeInTheDocument();
    expect(screen.getAllByText("Heading 1")[1]).toBeInTheDocument();
    expect(screen.getAllByText("Heading 2")[1]).toBeInTheDocument();
  });

  it("handles table of contents navigation", () => {
    render(<Article content={content} />);
    const heading1Link = screen.getAllByText("Heading 1")[1];
    const heading2Link = screen.getAllByText("Heading 2")[1];

    fireEvent.click(heading1Link);
    expect(heading1Link).toHaveClass("usa-current");
    fireEvent.click(heading2Link);
    expect(heading2Link).toHaveClass("usa-current");
  });

  it("toggles navigation menu on button click", () => {
    render(<Article content={content} />);
    const toggleButton = screen.getByRole("button", {
      name: /Table of Contents/,
    });
    fireEvent.click(toggleButton);
    expect(screen.getByRole("navigation")).toHaveClass("open");
    fireEvent.click(toggleButton);
    expect(screen.queryByRole("navigation")).not.toHaveClass("open");
  });
});
