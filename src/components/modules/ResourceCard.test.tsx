import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResourceCard } from "./ResourceCard";
import { ResourceCardProps } from "../../utils/types";

jest.mock("../../utils/parseMarkdownToHTML", () => ({
  parseMarkdownToHTML: jest.fn((markdown) => `<p>${markdown}</p>`),
}));

jest.mock("./Tag", () => ({
  Tag: jest.fn(({ title, color }) => <span data-testid="tag">{title}</span>),
}));

describe("ResourceCard", () => {
  const props: ResourceCardProps = {
    sys: { id: "1" },
    className: "test-class",
    description: "Test description",
    link: "/test-link",
    tagsCollection: {
      items: [
        {
          category: {
            sys: { id: "1" },
          },
          sys: { id: "1" },
          title: "Tag 1",
        },
        {
          category: {
            sys: { id: "2" },
          },
          sys: { id: "2" },
          title: "Tag 2",
        },
      ],
    },
    theme: "green",
    title: "Test Title",
  };

  it("renders correctly with required props", () => {
    const { getByText } = render(<ResourceCard {...props} />);
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  it("applies the className and theme props correctly", () => {
    const { container } = render(<ResourceCard {...props} />);
    expect(container.firstChild).toHaveClass("resourceCard");
    expect(container.firstChild).toHaveClass("theme-green");
    expect(container.firstChild).toHaveClass("test-class");
  });

  it("generates the correct link based on whether it is relative or external", () => {
    const { getByText, rerender } = render(<ResourceCard {...props} />);
    const link = getByText("Test Title").closest("a");
    expect(link).toHaveAttribute("href", "/test-link");
    expect(link).toHaveAttribute("target", "_self");

    rerender(<ResourceCard {...props} link="https://external-link.com" />);
    const externalLink = getByText("Test Title").closest("a");
    expect(externalLink).toHaveAttribute("href", "https://external-link.com");
    expect(externalLink).toHaveAttribute("target", "_blank");
    expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("converts the description from Markdown to HTML correctly", () => {
    const { container } = render(<ResourceCard {...props} />);
    const descriptionDiv = container.querySelector(".description");
    expect(descriptionDiv?.innerHTML).toBe("<p>Test description</p>");
  });

  it("renders the tags correctly", () => {
    const { getAllByTestId } = render(<ResourceCard {...props} />);
    const tags = getAllByTestId("tag");
    expect(tags).toHaveLength(2);
    expect(tags[0]).toHaveTextContent("Tag 1");
    expect(tags[1]).toHaveTextContent("Tag 2");
  });
});
