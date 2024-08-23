import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DropContent } from "./DropContent";
import { ContentfulRichText } from "./ContentfulRichText";
import { Heading } from "./Heading";
import { IconSelector } from "./IconSelector";
import { colors } from "../../utils/settings";
import { capitalizeFirstLetter } from "../../utils/capitalizeFirstLetter";

jest.mock("./Heading", () => ({
  Heading: jest.fn(({ level, children }) =>
    React.createElement(`h${level}`, {}, children),
  ),
}));

jest.mock("./IconSelector", () => ({
  IconSelector: jest.fn(({ name }) => (
    <div data-testid={`icon-${name}`}>{name}</div>
  )),
}));

jest.mock("../../utils/capitalizeFirstLetter", () => ({
  capitalizeFirstLetter: jest.fn(
    (str) => str.charAt(0).toUpperCase() + str.slice(1),
  ),
}));

describe("DropContent Component", () => {
  const defaultProps = {
    sys: {
      id: "123",
    },
    headingLevel: 2,
    testId: "drop-content",
    copy: "Click to toggle",
    icon: "Info" as const,
    systemIcon: "systemIcon" as const,
    message: {
      json: {
        nodeType: "document",
        data: {},
        content: [
          {
            nodeType: "paragraph",
            content: [
              {
                nodeType: "text",
                value: "This is a paragraph.",
                marks: [],
                data: {},
              },
            ],
            data: {},
          },
        ],
      },
    },
  };

  it("renders without crashing", () => {
    render(<DropContent {...defaultProps} />);
    expect(screen.getByText("Click to toggle")).toBeInTheDocument();
  });

  it("applies the correct class names and styles based on props", () => {
    render(<DropContent {...defaultProps} />);
    expect(screen.getByText("Click to toggle").closest("button")).toHaveStyle({
      backgroundColor: colors.secondaryLighter,
      color: colors.black,
    });
  });

  it("renders the heading with the correct level", () => {
    render(<DropContent {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders icons correctly", () => {
    render(<DropContent {...defaultProps} />);
    expect(screen.getByTestId("icon-Info")).toBeInTheDocument();
    expect(screen.getByTestId("icon-CaretUp")).toBeInTheDocument();
  });

  it("toggles content visibility on button click", () => {
    render(<DropContent {...defaultProps} />);
    const button = screen
      .getByText("Click to toggle")
      .closest("button") as HTMLButtonElement;
    const richTextContent = screen.getByText("This is a paragraph.");

    // Initially content should be visible
    expect(richTextContent.parentElement).toHaveClass("content open");

    // Click the button to hide content
    fireEvent.click(button);
    expect(richTextContent.parentElement).not.toHaveClass("open");

    // Click the button to show content again
    fireEvent.click(button);
    expect(richTextContent.parentElement).toHaveClass("content open");
  });
});
