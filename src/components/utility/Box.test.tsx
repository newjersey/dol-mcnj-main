import React from "react";
import { render } from "@testing-library/react";
import { Box } from "./Box";

describe("Box component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Box>Content</Box>);
    expect(container).toBeInTheDocument();
  });

  it("applies className correctly", () => {
    const { container } = render(<Box className="custom-class">Content</Box>);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies componentId correctly", () => {
    const { getByTestId } = render(
      <Box componentId="box-id" testId="box">
        Content
      </Box>,
    );
    expect(getByTestId("box")).toHaveAttribute("id", "box-id");
  });

  it("uses the correct element tag", () => {
    const { container } = render(<Box elementTag="section">Content</Box>);
    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("handles overflow and radius props correctly", () => {
    const { container } = render(
      <Box radius={10} overflow>
        Content
      </Box>,
    );
    expect(container.firstChild).toHaveClass("radius-10-overflow");
  });

  it("handles shadow prop correctly", () => {
    const { container } = render(<Box shadow={2}>Content</Box>);
    expect(container.firstChild).toHaveClass("shadow-2");
  });

  it("applies role correctly", () => {
    const { container } = render(<Box role="alert">Content</Box>);
    expect(container.firstChild).toHaveAttribute("role", "alert");
  });

  it("applies custom style correctly", () => {
    const style = { backgroundColor: "red" };
    const { container } = render(<Box style={style}>Content</Box>);
    expect(container.firstChild).toHaveStyle("background-color: red");
  });

  it("applies testId correctly", () => {
    const { getByTestId } = render(<Box testId="box">Content</Box>);
    expect(getByTestId("box")).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    const { getByText } = render(<Box>Content</Box>);
    expect(getByText("Content")).toBeInTheDocument();
  });
});
