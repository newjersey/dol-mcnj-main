import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InfoBox } from "./InfoBox";
import { toUsCurrency } from "../../utils/toUsCurrency";
import { LinkObject } from "./LinkObject";
import { Info } from "@phosphor-icons/react";

// Mock the toUsCurrency function
jest.mock("../../utils/toUsCurrency", () => ({
  toUsCurrency: jest.fn().mockImplementation((num) => `$${num.toFixed(2)}`),
}));

// Mock the Info icon component
jest.mock("@phosphor-icons/react", () => ({
  Info: jest.fn().mockReturnValue(<svg data-testid="info-icon" />),
}));

// Mock the LinkObject component
jest.mock("./LinkObject", () => ({
  LinkObject: jest.fn().mockReturnValue(<a data-testid="link-object" />),
}));

describe("InfoBox", () => {
  it("renders correctly with default props", () => {
    const { container } = render(<InfoBox />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders correctly with all props provided", () => {
    const { getByText, getByTestId } = render(
      <InfoBox
        className="test-class"
        copy="Test copy"
        currency={true}
        eyebrow="Test eyebrow"
        link={{ url: "https://example.com", copy: "Example Link" }}
        number={1234.56}
        theme="blue"
        tooltip="Test tooltip"
      />,
    );

    expect(getByText("Test eyebrow")).toBeInTheDocument();
    expect(getByTestId("info-icon")).toBeInTheDocument();
    expect(getByText("Test copy")).toBeInTheDocument();
    expect(getByText("$1234.56")).toBeInTheDocument();
    expect(getByTestId("link-object")).toBeInTheDocument();
  });

  it("handles the className prop correctly", () => {
    const { container } = render(<InfoBox className="test-class" />);
    expect(container.firstChild).toHaveClass("test-class");
  });

  it("displays the eyebrow text when provided", () => {
    const { getByText } = render(<InfoBox eyebrow="Test eyebrow" />);
    expect(getByText("Test eyebrow")).toBeInTheDocument();
  });

  it("displays the tooltip icon when tooltip is provided", () => {
    const { getByTestId } = render(
      <InfoBox eyebrow="Test eyebrow" tooltip="Test tooltip" />,
    );
    expect(getByTestId("info-icon")).toBeInTheDocument();
  });

  it("displays the copy text when provided", () => {
    const { getByText } = render(<InfoBox copy="Test copy" />);
    expect(getByText("Test copy")).toBeInTheDocument();
  });

  it("displays the number in currency format when currency is true", () => {
    const { getByText } = render(<InfoBox number={1234.56} currency={true} />);
    expect(getByText("$1234.56")).toBeInTheDocument();
  });

  it("displays the number as a plain number when currency is false", () => {
    const { getByText } = render(<InfoBox number={1234.56} currency={false} />);
    expect(getByText("1234.56")).toBeInTheDocument();
  });

  it("displays a placeholder when number is not provided", () => {
    const { getByText } = render(<InfoBox />);
    expect(getByText("--")).toBeInTheDocument();
  });

  it("renders the link when link prop is provided", () => {
    const { getByTestId } = render(
      <InfoBox link={{ url: "https://example.com", copy: "Example Link" }} />,
    );
    expect(getByTestId("link-object")).toBeInTheDocument();
  });
});
