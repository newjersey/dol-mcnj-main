import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Heading, HeadingProps } from "./Heading";
import { HeadingLevel } from "../../utils/types";

// Utility function to render the Heading component with default props
const renderHeading = (props: Partial<HeadingProps> = {}) => {
  const defaultProps: HeadingProps = {
    level: 1 as HeadingLevel,
    ...props,
  };

  return render(<Heading {...defaultProps} />);
};

describe("Heading component", () => {
  it("renders with different heading levels", () => {
    const levels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

    levels.forEach((level) => {
      renderHeading({ level, children: `Heading level ${level}` });

      const heading = screen.getByText(`Heading level ${level}`);
      expect(heading.tagName).toBe(`H${level}`);
    });
  });

  it("renders with children", () => {
    renderHeading({ level: 1, children: "Heading with children" });

    const heading = screen.getByText("Heading with children");
    expect(heading).toBeInTheDocument();
  });

  it("renders with dangerouslySetInnerHTML", () => {
    const htmlContent = "<span>HTML content</span>";
    renderHeading({ level: 1, html: { __html: htmlContent } });

    const heading = screen.getByText("HTML content");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("SPAN");
  });

  it("handles className prop", () => {
    renderHeading({
      level: 1,
      children: "Heading with class",
      className: "custom-class",
    });

    const heading = screen.getByText("Heading with class");
    expect(heading).toHaveClass("heading-tag custom-class");
  });

  it("renders with both className and dangerouslySetInnerHTML", () => {
    const htmlContent = "<span>HTML content with class</span>";
    renderHeading({
      level: 1,
      html: { __html: htmlContent },
      className: "custom-class",
    });

    const heading = screen.getByText("HTML content with class");
    expect(heading.parentElement).toHaveClass("heading-tag custom-class");
    expect(heading.tagName).toBe("SPAN");
  });

  it("renders without className", () => {
    renderHeading({ level: 1, children: "Heading without class" });

    const heading = screen.getByText("Heading without class");
    expect(heading).toHaveClass("heading-tag");
    expect(heading).not.toHaveClass("custom-class");
  });
});
