import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Tag } from "./Tag";

// Mock the IconSelector component
jest.mock("./IconSelector", () => ({
  IconSelector: jest.fn((props) => (
    <svg {...props} data-testid="icon-selector" />
  )),
}));

describe("Tag", () => {
  const props = {
    title: "Test Tag",
    color: "blue",
  };

  it("renders correctly with required props", () => {
    const { getByText } = render(<Tag {...props} />);
    expect(getByText("Test Tag")).toBeInTheDocument();
  });

  it("applies the className, color, and chip props correctly", () => {
    const { container } = render(
      <Tag {...props} className="test-class" chip />,
    );
    expect(container.firstChild).toHaveClass(
      "tag-item test-class color-blue chip",
    );
  });

  it("renders the title correctly", () => {
    const { getByText } = render(<Tag {...props} />);
    expect(getByText("Test Tag")).toBeInTheDocument();
  });

  it("renders the icon correctly when provided", () => {
    const { getByTestId } = render(
      <Tag {...props} icon="TestIcon" iconWeight="bold" />,
    );
    expect(getByTestId("icon-selector")).toBeInTheDocument();
    expect(getByTestId("icon-selector")).toHaveAttribute("name", "TestIcon");
    expect(getByTestId("icon-selector")).toHaveAttribute("weight", "bold");
    expect(getByTestId("icon-selector")).toHaveAttribute("size", "15");
  });

  it("renders the suffixIcon correctly when provided", () => {
    const { getAllByTestId } = render(
      <Tag {...props} suffixIcon="SuffixIcon" iconWeight="bold" />,
    );
    const icons = getAllByTestId("icon-selector");
    expect(icons).toHaveLength(1);
    expect(icons[0]).toHaveAttribute("name", "SuffixIcon");
    expect(icons[0]).toHaveAttribute("weight", "bold");
    expect(icons[0]).toHaveAttribute("size", "15");
  });

  it("renders both icon and suffixIcon correctly when provided", () => {
    const { getAllByTestId } = render(
      <Tag
        {...props}
        icon="TestIcon"
        suffixIcon="SuffixIcon"
        iconWeight="bold"
      />,
    );
    const icons = getAllByTestId("icon-selector");
    expect(icons).toHaveLength(2);
    expect(icons[0]).toHaveAttribute("name", "TestIcon");
    expect(icons[0]).toHaveAttribute("weight", "bold");
    expect(icons[0]).toHaveAttribute("size", "15");
    expect(icons[1]).toHaveAttribute("name", "SuffixIcon");
    expect(icons[1]).toHaveAttribute("weight", "bold");
    expect(icons[1]).toHaveAttribute("size", "15");
  });
});
