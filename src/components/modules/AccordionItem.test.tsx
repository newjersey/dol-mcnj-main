import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AccordionItem, AccordionItemProps } from "./AccordionItem";
import { Document, TopLevelBlock } from "@contentful/rich-text-types";

describe("AccordionItem component", () => {
  const defaultContent: Document = {
    nodeType: "document" as Document["nodeType"],
    content: [
      {
        data: {},
        content: [
          {
            data: {},
            marks: [],
            value:
              "Private career schools offer career training to adults. They are also known as proprietary\nschools. The definition of a private career school in New Jersey is a privately owned\npostsecondary school that offers one or more occupational training programs and is a\nqualifying school as defined by P.L. 2005, c. 354.",
            nodeType: "text",
          },
        ],
        nodeType: "paragraph" as TopLevelBlock["nodeType"],
      },
    ],
    data: {},
  };

  const defaultProps: AccordionItemProps = {
    title: "Accordion Title",
    content: defaultContent,
    keyValue: 0,
    open: false,
  };

  const renderComponent = (props = {}) => {
    return render(<AccordionItem {...defaultProps} {...props} />);
  };

  it("renders with default props", () => {
    renderComponent();
    expect(screen.getByTestId("accordion")).toBeInTheDocument();
    expect(screen.getByText("Accordion Title")).toBeInTheDocument();
  });

  it("handles open state based on props", () => {
    renderComponent({ open: true });
    // wait for useEffect to run
    expect(screen.getByTestId("accordion")).toHaveClass("open");

    // click to open
    fireEvent.click(screen.getByTestId("accordion-button"));

    expect(screen.getByTestId("accordion")).toHaveClass("closed");
  });

  it("toggles open/close state on button click", () => {
    renderComponent();
    const button = screen.getByTestId("accordion-button");
    expect(screen.getByTestId("accordion")).toHaveClass("closed");

    // Click to open
    fireEvent.click(button);

    expect(screen.getByTestId("accordion")).toHaveClass("open");

    // Click to close
    fireEvent.click(button);

    expect(screen.getByTestId("accordion")).toHaveClass("closed");
  });

  it("handles title as ReactElement", () => {
    renderComponent({ title: <div>React Element Title</div> });
    expect(screen.getByText("React Element Title")).toBeInTheDocument();
  });
});
