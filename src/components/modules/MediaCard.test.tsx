import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MediaCard } from "./MediaCard";
import Image from "next/image";

// Mock the highlighter function
jest.mock("../../utils/highlighter", () => ({
  highlighter: jest.fn((text) => `<mark>${text}</mark>`), // Simplified mock implementation
}));

// Mock the ResponsiveImage component
jest.mock("./ResponsiveImage", () => ({
  ResponsiveImage: jest.fn().mockReturnValue(
    // eslint-disable-next-line @next/next/no-img-element
    <img src="../image.jpg" alt="" data-testid="responsive-image" />,
  ),
}));

describe("MediaCard", () => {
  it("renders correctly with required props", () => {
    const { getByText } = render(<MediaCard title="Test Title" />);
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  it("renders correctly with all optional props provided", () => {
    const { getByText, getByTestId } = render(
      <MediaCard
        className="test-class"
        description="Test Description"
        headingLevel={2}
        image={{ url: "https://example.com/image.jpg", lqip: "lqip" }}
        title="Test Title"
        url="https://example.com"
      />,
    );

    const mediaCard = document.querySelector(".media-card");

    expect(mediaCard?.tagName).toBe("A");
    expect(getByTestId("responsive-image")).toBeInTheDocument();
    expect(getByText("Test Title")).toBeInTheDocument();
    expect(getByText("Test Description")).toBeInTheDocument();
  });

  it("renders the image correctly when the image prop is provided", () => {
    const { getByTestId } = render(
      <MediaCard
        title="Test Title"
        image={{ url: "https://example.com/image.jpg", lqip: "lqip" }}
      />,
    );
    expect(getByTestId("responsive-image")).toBeInTheDocument();
  });

  it("renders the title correctly with highlighter applied", () => {
    const { container } = render(<MediaCard title="Test Title" />);
    expect(container.querySelector("h3")?.innerHTML).toBe(
      "<mark>Test Title</mark>",
    );
  });

  it("renders the description correctly with highlighter applied", () => {
    const { container } = render(
      <MediaCard title="Test Title" description="Test Description" />,
    );
    expect(container.querySelector("p")?.innerHTML).toBe(
      "<mark>Test Description</mark>",
    );
  });

  it("renders as a plain div when the url prop is not provided", () => {
    const { container } = render(<MediaCard title="Test Title" />);
    expect(container.querySelector(".media-card")).toBeInTheDocument();
    expect(container.querySelector("a")).not.toBeInTheDocument();
  });
});
