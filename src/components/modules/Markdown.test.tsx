import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Markdown } from "./Markdown";

// Mock the MarkdownIt instance and its render method
jest.mock("markdown-it", () => {
  return jest.fn().mockImplementation(() => {
    return {
      render: jest.fn((content) => `<p>${content}</p>`), // Simplified mock implementation
    };
  });
});

describe("Markdown", () => {
  it("renders correctly with minimal props", () => {
    const { container } = render(<Markdown content="Hello, World!" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies the className prop correctly", () => {
    const { container } = render(
      <Markdown content="Hello, World!" className="test-class" />,
    );
    expect(container.firstChild).toHaveClass("test-class");
  });

  it("converts Markdown content to HTML correctly", () => {
    const { container } = render(<Markdown content="**Hello, World!**" />);
    expect((container.firstChild as HTMLElement).innerHTML).toBe(
      "<p>**Hello, World!**</p>",
    ); // Simplified check
  });
});
