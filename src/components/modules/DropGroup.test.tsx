import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DropGroup } from "./DropGroup";

jest.mock("@phosphor-icons/react", () => ({
  CaretRight: jest.fn(() => <svg data-testid="caret-right" />),
}));

jest.mock("../../utils/slugify", () => ({
  slugify: jest.fn((str: string) => str.toLowerCase().replace(/\s+/g, "-")),
}));

describe("DropGroup Component", () => {
  const topics = {
    items: [
      { sys: { id: "1" }, topic: "Topic 1" },
      { sys: { id: "2" }, topic: "Topic 2" },
    ],
  };

  const defaultProps = {
    sys: { id: "dropgroup-1" },
    title: "Sample Title",
    testId: "dropgroup",
    topics,
  };

  it("renders without crashing", () => {
    render(<DropGroup {...defaultProps} />);
    expect(screen.getByText("Sample Title")).toBeInTheDocument();
  });

  it("applies the correct class names based on props", () => {
    const { rerender } = render(
      <DropGroup {...defaultProps} className="custom-class" />,
    );
    expect(screen.getByTestId("dropgroup")).toHaveClass(
      "dropGroup custom-class",
    );

    rerender(<DropGroup {...defaultProps} className="" />);
    expect(screen.getByTestId("dropgroup")).toHaveClass("dropGroup");
  });

  it("toggles content visibility on button click", () => {
    render(<DropGroup {...defaultProps} />);
    const button = screen
      .getByText("Sample Title")
      .closest("button") as HTMLButtonElement;
    const list = screen.getByRole("list");

    // Initially content should be hidden
    expect(list).not.toHaveClass("active");

    // Click the button to show content
    fireEvent.click(button);
    expect(list).toHaveClass("active");

    // Click the button to hide content
    fireEvent.click(button);
    expect(list).not.toHaveClass("active");
  });

  it("sets active topic correctly on button click", () => {
    render(<DropGroup {...defaultProps} />);
    const topicButtons = screen.getAllByRole("button");

    // // Click the first topic button
    fireEvent.click(topicButtons[0]);
    expect(topicButtons[0].parentElement).toHaveClass("active");

    // Click the second topic button
    fireEvent.click(topicButtons[1]);
    expect(topicButtons[1].parentElement?.parentElement).toHaveClass("active");
    expect(topicButtons[0].parentElement?.parentElement).not.toHaveClass(
      "active",
    );
  });

  it("calls onChange with the correct topic when a topic is clicked", () => {
    const onChangeMock = jest.fn();
    render(<DropGroup {...defaultProps} onChange={onChangeMock} />);
    const topicButtons = screen.getAllByRole("button");

    // Click the first topic button
    fireEvent.click(topicButtons[1]);
    expect(onChangeMock).toHaveBeenCalledWith(topics.items[0]);

    // Click the second topic button
    fireEvent.click(topicButtons[2]);
    expect(onChangeMock).toHaveBeenCalledWith(topics.items[1]);
  });

  it("handles URL hash correctly to set active topic on mount", () => {
    window.location.hash = "#topic-2";
    render(<DropGroup {...defaultProps} />);
    const topicButtons = screen.getAllByRole("button");

    // The topic with hash should be active
    expect(topicButtons[0].parentElement).toHaveClass("active");
  });
});
