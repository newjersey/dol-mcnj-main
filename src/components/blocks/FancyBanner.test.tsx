/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FancyBanner } from "./FancyBanner";
import { PageBannerProps } from "../../utils/types";

jest.mock("../modules/ContentfulRichText", () => ({
  ContentfulRichText: ({ document }: any) => (
    <div data-testid="rich-text">{JSON.stringify(document)}</div>
  ),
}));

jest.mock("../modules/ResponsiveImage", () => ({
  ResponsiveImage: ({ src, alt, width, height }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-testid="responsive-image"
    />
  ),
}));

describe("FancyBanner Component", () => {
  const props: PageBannerProps = {
    title: "Test Title",
    theme: "blue",
    message: { json: { content: "Test Message" } } as any,
    className: "test-class",
    image: {
      sys: {
        id: "123",
      },
      url: "/test-image.jpg",
      width: 100,
      height: 100,
    },
    buttonCopy: "Test Button",
  };

  it("renders without crashing", () => {
    const { container } = render(<FancyBanner {...props} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with all props correctly", () => {
    const { getByText, getByTestId } = render(<FancyBanner {...props} />);
    expect(getByText("Test Title")).toBeInTheDocument();
    expect(getByTestId("rich-text")).toHaveTextContent(
      typeof props.message === "string"
        ? props.message
        : JSON.stringify(props.message?.json)
    );
    expect(getByText("Test Button")).toBeInTheDocument();
    expect(getByTestId("responsive-image")).toHaveAttribute(
      "src",
      "/test-image.jpg"
    );
  });

  it("renders without optional props correctly", () => {
    const { container } = render(<FancyBanner title="Test Title" />);
    expect(container).toBeInTheDocument();
    expect(container.querySelector(".copy h1")).toHaveTextContent("Test Title");
    expect(container.querySelector(".copy")).not.toContainElement(
      container.querySelector("button")
    );
    expect(container.querySelector(".image")).not.toBeInTheDocument();
  });

  it("scrolls to element when button is clicked", () => {
    document.body.innerHTML = '<div id="tools"></div>';
    const { getByText } = render(<FancyBanner {...props} />);
    const button = getByText("Test Button");

    const scrollIntoViewMock = jest.fn();
    document.getElementById("tools")!.scrollIntoView = scrollIntoViewMock;

    fireEvent.click(button);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("applies className correctly", () => {
    const { container } = render(<FancyBanner {...props} />);
    expect(container.firstChild).toHaveClass("fancyBanner test-class");
  });

  it("renders ResponsiveImage and ContentfulRichText with correct props", () => {
    const { getByTestId } = render(<FancyBanner {...props} />);
    const richText = getByTestId("rich-text");
    const responsiveImage = getByTestId("responsive-image");

    expect(richText).toHaveTextContent(
      typeof props.message !== "string"
        ? JSON.stringify(props.message?.json)
        : props.message
    );
    expect(responsiveImage).toHaveAttribute("src", props.image?.url);
    expect(responsiveImage).toHaveAttribute(
      "width",
      props.image?.width.toString()
    );
    expect(responsiveImage).toHaveAttribute(
      "height",
      props.image?.height.toString()
    );
  });
});
