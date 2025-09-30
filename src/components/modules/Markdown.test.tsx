import React from "react";
import { render, screen } from "@testing-library/react";
import { Markdown } from "./Markdown";
import "@testing-library/jest-dom";

// 👇 Mock the markdown parser
jest.mock("../../utils/parseMarkdownToHTML", () => ({
  parseMarkdownToHTML: jest.fn((markdown: string) => {
    if (markdown === "") return "";
    // Fake markdown-to-HTML output for testing
    return `<h1>${markdown}</h1>`;
  }),
}));

describe("Markdown", () => {
  it("renders parsed HTML from markdown content", () => {
    render(<Markdown content="Hello Markdown" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Hello Markdown");
  });

  it("applies className when provided", () => {
    render(<Markdown content="Hello" className="test-class" />);
    const container = screen.getByText("Hello").parentElement;
    expect(container).toHaveClass("test-class");
  });

  it("renders safely with empty content", () => {
    const { container } = render(
      <Markdown content="" className="empty-test" />
    );
    const div = container.querySelector(".empty-test");
    expect(div).toBeInTheDocument();
    expect(div).toBeEmptyDOMElement();
  });
});
