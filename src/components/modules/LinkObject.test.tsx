import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LinkObject } from "./LinkObject";

// Mock the icons
jest.mock("@phosphor-icons/react", () => ({
  ArrowSquareOut: jest
    .fn()
    .mockReturnValue(<svg data-testid="arrow-square-out" />),
  House: jest.fn().mockReturnValue(<svg data-testid="house-icon" />),
}));

window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe("LinkObject", () => {
  it("renders correctly with minimal props", () => {
    const { getByText } = render(<LinkObject url="/">Home</LinkObject>);
    expect(getByText("Home")).toBeInTheDocument();
  });

  it("renders correctly with all props provided", () => {
    const { getByText, getByTestId } = render(
      <LinkObject
        className="test-class"
        id="test-id"
        role="button"
        url="https://example.com"
        noIndicator={false}
        onClick={() => {}}
        style={{ color: "red" }}
      >
        External Link
      </LinkObject>,
    );

    expect(getByText("External Link")).toBeInTheDocument();
    expect(getByText("External Link").closest("a")).toHaveClass("test-class");
    expect(getByText("External Link").closest("a")).toHaveAttribute(
      "id",
      "test-id",
    );
    expect(getByText("External Link").closest("a")).toHaveAttribute(
      "role",
      "button",
    );
    expect(getByText("External Link").closest("a")).toHaveStyle({
      color: "red",
    });
    expect(getByTestId("arrow-square-out")).toBeInTheDocument();
  });

  it("handles internal links correctly", () => {
    const { getByText } = render(
      <LinkObject url="/internal">Internal Link</LinkObject>,
    );
    expect(getByText("Internal Link").closest("a")).toHaveAttribute(
      "href",
      "/internal",
    );
    expect(getByText("Internal Link").closest("a")).not.toHaveAttribute(
      "target",
    );
    expect(getByText("Internal Link").closest("a")).not.toHaveAttribute("rel");
  });

  it("handles external links correctly", () => {
    const { getByText, getByTestId } = render(
      <LinkObject url="https://external.com">External Link</LinkObject>,
    );
    expect(getByText("External Link").closest("a")).toHaveAttribute(
      "href",
      "https://external.com",
    );
    expect(getByText("External Link").closest("a")).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(getByText("External Link").closest("a")).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(getByTestId("arrow-square-out")).toBeInTheDocument();
  });

  it("handles hash links correctly and scrolls to the element", () => {
    document.body.innerHTML = '<div id="hash-element">Hash Element</div>';
    const { getByText } = render(
      <LinkObject url="#hash-element">Hash Link</LinkObject>,
    );
    fireEvent.click(getByText("Hash Link"));
    expect(
      document.getElementById("hash-element")?.scrollIntoView,
    ).toHaveBeenCalled();
  });

  it("executes the onClick handler when provided", () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <LinkObject url="/" onClick={handleClick}>
        Click Me
      </LinkObject>,
    );
    fireEvent.click(getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies the className, role, id, and style props correctly", () => {
    const { getByText } = render(
      <LinkObject
        className="test-class"
        role="button"
        id="test-id"
        style={{ color: "red" }}
        url="/"
      >
        Styled Link
      </LinkObject>,
    );
    const link = getByText("Styled Link").closest("a");
    expect(link).toHaveClass("test-class");
    expect(link).toHaveAttribute("role", "button");
    expect(link).toHaveAttribute("id", "test-id");
    expect(link).toHaveStyle({ color: "red" });
  });

  it("displays the House icon when the URL is the homepage and noIndicator is false", () => {
    const { getByTestId } = render(
      <LinkObject url="/" noIndicator={false}>
        Home
      </LinkObject>,
    );
    expect(getByTestId("house-icon")).toBeInTheDocument();
  });

  it("does not display the House icon when noIndicator is true", () => {
    const { queryByTestId } = render(
      <LinkObject url="/" noIndicator={true}>
        Home
      </LinkObject>,
    );
    expect(queryByTestId("house-icon")).not.toBeInTheDocument();
  });

  it("displays the ArrowSquareOut icon for external links when noIndicator is false", () => {
    const { getByTestId } = render(
      <LinkObject url="https://external.com" noIndicator={false}>
        External Link
      </LinkObject>,
    );
    expect(getByTestId("arrow-square-out")).toBeInTheDocument();
  });

  it("does not display the ArrowSquareOut icon for external links when noIndicator is true", () => {
    const { queryByTestId } = render(
      <LinkObject url="https://external.com" noIndicator={true}>
        External Link
      </LinkObject>,
    );
    expect(queryByTestId("arrow-square-out")).not.toBeInTheDocument();
  });
});
