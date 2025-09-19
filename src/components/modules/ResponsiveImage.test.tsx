import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ResponsiveImage } from "./ResponsiveImage";

describe("ResponsiveImage", () => {
  const props = {
    src: "https://example.com/image.jpg",
    alt: "Example Image",
    width: 100,
    height: 100,
  };

  const backgroundProps = {
    src: "https://example.com/image.jpg",
    alt: "Example Image",
    isBackground: true,
  };

  it("renders correctly with required props", () => {
    const { getByAltText } = render(<ResponsiveImage {...props} />);
    const img = getByAltText("Example Image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      "/_next/image?url=https%3A%2F%2Fexample.com%2Fimage.jpg&w=256&q=100",
    );
    expect(img).toHaveAttribute("alt", "Example Image");
  });

  it("applies the className prop correctly", () => {
    const { container } = render(
      <ResponsiveImage {...props} className="test-class" />,
    );
    expect(container.firstChild).toHaveClass("image-container test-class");
  });

  it("handles the noContainer prop correctly", () => {
    const { container } = render(<ResponsiveImage {...props} noContainer />);
    expect((container.firstChild as HTMLElement)?.tagName).toBe("IMG");
  });

  it("renders the image with the correct attributes based on the isBackground prop", () => {
    const { container } = render(
      <ResponsiveImage {...backgroundProps} isBackground />,
    );
    expect(container.firstChild).toHaveClass("background-container");
  });

  it("renders the image with width and height when isBackground is false", () => {
    const { getByAltText } = render(
      <ResponsiveImage {...props} width={100} height={100} />,
    );
    const img = getByAltText("Example Image");
    expect(img).toHaveAttribute("width", "100");
    expect(img).toHaveAttribute("height", "100");
  });

  it("renders the image without width and height when isBackground is true", () => {
    const { getByAltText } = render(
      <ResponsiveImage {...backgroundProps} isBackground />,
    );
    const img = getByAltText("Example Image");
    expect(img).not.toHaveAttribute("width");
    expect(img).not.toHaveAttribute("height");
  });

  it("applies the sizes attribute correctly", () => {
    const { getByAltText } = render(
      <ResponsiveImage {...props} sizes="(max-width: 600px) 100vw, 600px" />,
    );
    const img = getByAltText("Example Image");
    expect(img).toHaveAttribute("sizes", "(max-width: 600px) 100vw, 600px");
  });
});
