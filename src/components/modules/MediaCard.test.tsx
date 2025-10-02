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
    <img src="../image.jpg" alt="" data-testid="responsive-image" />
  ),
}));

describe("MediaCard", () => {
  it("renders correctly with required props", () => {
    const { getByText } = render(<MediaCard title="Test Title" />);
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  it("renders correctly with all optional props provided", () => {
    const { getByText, getByRole } = render(
      <MediaCard
        className="test-class"
        description="Test Description"
        image={{
          src: "https://example.com/image.jpg",
          alt: "Test image",
          width: 400,
          height: 300,
        }}
        title="Test Title"
      />
    );

    const mediaCard = document.querySelector(".media-card");

    expect(mediaCard?.tagName).toBe("DIV");
    expect(getByRole("img")).toBeInTheDocument();
    expect(getByText("Test Title")).toBeInTheDocument();
    expect(getByText("Test Description")).toBeInTheDocument();
  });

  it("renders the image correctly when the image prop is provided", () => {
    const { getByRole } = render(
      <MediaCard
        title="Test Title"
        image={{
          src: "https://example.com/image.jpg",
          alt: "Test image",
          width: 400,
          height: 300,
        }}
      />
    );
    expect(getByRole("img")).toBeInTheDocument();
  });

  it("renders the title correctly", () => {
    const { getByText } = render(<MediaCard title="Test Title" />);
    expect(getByText("Test Title")).toBeInTheDocument();
    expect(getByText("Test Title").tagName).toBe("P");
  });

  it("renders the description correctly with markdown parsing", () => {
    const { container } = render(
      <MediaCard title="Test Title" description="Test Description" />
    );
    const descriptionElement = container.querySelector(".description");
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement?.innerHTML).toBe("<p>Test Description</p>\n");
  });

  it("renders as a plain div when the url prop is not provided", () => {
    const { container } = render(<MediaCard title="Test Title" />);
    expect(container.querySelector(".media-card")).toBeInTheDocument();
    expect(container.querySelector("a")).not.toBeInTheDocument();
  });
});
