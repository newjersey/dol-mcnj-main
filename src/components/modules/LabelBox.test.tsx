import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LabelBox } from "./LabelBox";

jest.mock("./IconSelector", () => ({
  IconSelector: jest.fn().mockReturnValue(<svg data-testid="icon-selector" />),
}));

describe("LabelBox", () => {
  it("renders correctly with default props", () => {
    const { container } = render(
      <LabelBox color="navy" title="Test Title">
        Test Children
      </LabelBox>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders correctly with all props provided", () => {
    const { getByText, getAllByTestId } = render(
      <LabelBox
        centered={true}
        className="test-class"
        color="red"
        headingLevel={2}
        bgFill={true}
        icon="test-icon"
        iconSuffix="test-icon-suffix"
        iconWeight="bold"
        title="Test Title"
      >
        Test Children
      </LabelBox>,
    );

    expect(getByText("Test Title")).toBeInTheDocument();
    expect(getAllByTestId("icon-selector")).toHaveLength(2);
    expect(getByText("Test Children")).toBeInTheDocument();
  });

  it("applies the className, color, centered, and bgFill props correctly", () => {
    const { container } = render(
      <LabelBox
        className="test-class"
        color="green"
        centered={true}
        bgFill={true}
        title="Test Title"
      >
        Test Children
      </LabelBox>,
    );
    const box = container.firstChild;
    expect(box).toHaveClass("labelBox");
    expect(box).toHaveClass("test-class");
    expect(box).toHaveClass("color-green");
    expect(box).toHaveClass("centered");
    expect(box).toHaveClass("bg-fill");
  });

  it("displays the icon and iconSuffix when provided", () => {
    const { getAllByTestId } = render(
      <LabelBox
        color="blue"
        icon="test-icon"
        iconSuffix="test-icon-suffix"
        title="Test Title"
      >
        Test Children
      </LabelBox>,
    );
    expect(getAllByTestId("icon-selector")).toHaveLength(2);
  });

  it("displays the title correctly", () => {
    const { getByText } = render(
      <LabelBox color="navy" title="Test Title">
        Test Children
      </LabelBox>,
    );
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <LabelBox color="navy" title="Test Title">
        Test Children
      </LabelBox>,
    );
    expect(getByText("Test Children")).toBeInTheDocument();
  });
});
