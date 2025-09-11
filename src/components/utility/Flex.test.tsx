import React from "react";
import { render } from "@testing-library/react";
import { Flex } from "./Flex";
import { FlexProps } from "../../utils/types";

describe("Flex component", () => {
  const defaultProps: FlexProps = {
    alignItems: "flex-start",
    columnBreak: "sm",
    direction: "row",
    gap: "md",
    justifyContent: "flex-start",
    children: (
      <>
        <div>Child 1</div>
        <div>Child 2</div>
      </>
    ),
  };

  const renderComponent = (props = {}) =>
    render(<Flex {...defaultProps} {...props} />);

  it("renders with default props", () => {
    const { container } = renderComponent();
    expect(container.firstChild).toHaveClass(
      "mcnj-flex direction-row align-flex-start justify-flex-start gap-md column-sm",
    );
  });

  it("applies custom className", () => {
    const { container } = renderComponent({ className: "custom-class" });
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders children", () => {
    const { getByText } = renderComponent();
    expect(getByText("Child 1")).toBeInTheDocument();
    expect(getByText("Child 2")).toBeInTheDocument();
  });

  it("applies customLayout class", () => {
    const { container } = renderComponent({
      customLayout: "one-third-two-thirds",
    });
    expect(container.firstChild).toHaveClass("one-third-two-thirds");
  });

  it("handles direction prop", () => {
    const { container } = renderComponent({ direction: "column" });
    expect(container.firstChild).toHaveClass("direction-column");
  });

  it("handles fill prop", () => {
    const { container } = renderComponent({ fill: true });
    expect(container.firstChild).toHaveClass("fill");
  });

  it("handles flexWrap prop", () => {
    const { container } = renderComponent({ flexWrap: "wrap" });
    expect(container.firstChild).toHaveClass("wrap-wrap");
  });

  it("handles noBreak prop", () => {
    const { container } = renderComponent({ noBreak: true });
    expect(container.firstChild).toHaveClass("no-break");
  });

  it("handles breakpoint prop", () => {
    const { container } = renderComponent({ breakpoint: "lg" });
    expect(container.firstChild).toHaveClass("break-lg");
  });

  it("handles alignItems prop", () => {
    const { container } = renderComponent({ alignItems: "center" });
    expect(container.firstChild).toHaveClass("align-center");
  });

  it("handles justifyContent prop", () => {
    const { container } = renderComponent({ justifyContent: "space-between" });
    expect(container.firstChild).toHaveClass("justify-space-between");
  });

  it("handles ariaLabel prop", () => {
    const { getByLabelText } = renderComponent({ ariaLabel: "flex-container" });
    expect(getByLabelText("flex-container")).toBeInTheDocument();
  });

  it("applies role prop", () => {
    const { container } = renderComponent({ role: "banner" });
    expect(container.firstChild).toHaveAttribute("role", "banner");
  });

  it("applies style prop", () => {
    const style = { backgroundColor: "red" };
    const { container } = renderComponent({ style });
    expect(container.firstChild).toHaveStyle("background-color: red");
  });

  it("applies componentId prop", () => {
    const { container } = renderComponent({ componentId: "flex-1" });
    expect(container.firstChild).toHaveAttribute("id", "flex-1");
  });

  it("applies testId prop", () => {
    const { getByTestId } = renderComponent({ testId: "flex-container" });
    expect(getByTestId("flex-container")).toBeInTheDocument();
  });

  it("handles elementTag prop", () => {
    const { container } = renderComponent({ elementTag: "section" });
    expect(container.firstChild).not.toBeNull();
    expect((container.firstChild as HTMLElement).tagName).toBe("SECTION");
  });
});
