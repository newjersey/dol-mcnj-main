import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Spinner } from "./Spinner";

// Mock the SpinnerGap icon
jest.mock("@phosphor-icons/react", () => ({
  SpinnerGap: jest.fn((props) => <svg {...props} data-testid="spinner-icon" />),
}));

describe("Spinner", () => {
  it("renders correctly with default props", () => {
    const { getByTestId } = render(<Spinner />);
    const spinnerIcon = getByTestId("spinner-icon");
    expect(spinnerIcon).toBeInTheDocument();
    expect(spinnerIcon).toHaveAttribute("size", "50");
  });

  it("applies the className prop correctly", () => {
    const { container } = render(<Spinner className="test-class" />);
    expect(container.firstChild).toHaveClass("spinner test-class");
  });

  it("renders the spinner with the correct size and color props", () => {
    const { getByTestId } = render(<Spinner size={100} color="red" />);
    const spinnerIcon = getByTestId("spinner-icon");
    expect(spinnerIcon).toHaveAttribute("size", "100");
    expect(spinnerIcon).toHaveAttribute("color", "red");
  });
});
