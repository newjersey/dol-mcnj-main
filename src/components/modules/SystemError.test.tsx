import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SystemError } from "./SystemError";

// Mock the Heading component and WarningCircle icon
jest.mock("./Heading", () => ({
  Heading: jest.fn(({ children, level }) =>
    React.createElement(`h${level}`, null, children),
  ),
}));

jest.mock("@phosphor-icons/react", () => ({
  WarningCircle: jest.fn((props) => (
    <svg {...props} data-testid="warning-icon" />
  )),
}));

describe("SystemError", () => {
  const props = {
    heading: "Error occurred",
    color: "red",
  };

  it("renders correctly with required props", () => {
    const { getByText } = render(<SystemError {...props} />);
    expect(getByText("Error occurred")).toBeInTheDocument();
  });

  it("applies the className and color props correctly", () => {
    const { container } = render(
      <SystemError {...props} className="test-class" />,
    );
    expect(container.firstChild).toHaveClass(
      "systemError test-class color-red",
    );
  });

  it("renders the heading correctly", () => {
    const { getByText } = render(<SystemError {...props} />);
    expect(getByText("Error occurred")).toBeInTheDocument();
  });

  it("renders the copy correctly when provided", () => {
    const { container } = render(
      <SystemError {...props} copy="This is an error message." />,
    );
    expect(container.querySelector(".copy")?.innerHTML).toBe(
      "This is an error message.",
    );
  });

  it("renders the WarningCircle icon correctly", () => {
    const { getByTestId } = render(<SystemError {...props} />);
    expect(getByTestId("warning-icon")).toBeInTheDocument();
    expect(getByTestId("warning-icon")).toHaveAttribute("size", "64");
  });
});
