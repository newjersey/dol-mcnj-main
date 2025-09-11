import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { VideoBlock } from "./VideoBlock";
import { colors } from "../../utils/settings";

// Mock the Button component and YoutubeLogo icon
jest.mock("../modules/Button", () => ({
  Button: jest.fn(({ children, link }) => <a href={link}>{children}</a>),
}));

jest.mock("@phosphor-icons/react", () => ({
  YoutubeLogo: jest.fn((props) => (
    <svg {...props} data-testid="youtube-logo" />
  )),
}));

describe("VideoBlock", () => {
  const videoUrl = "https://www.youtube.com/embed/test-video-id";

  it("renders correctly with required props", () => {
    const { getByTitle } = render(<VideoBlock video={videoUrl} />);
    expect(getByTitle("YouTube video player")).toBeInTheDocument();
  });

  it("applies the className prop correctly", () => {
    const { container } = render(
      <VideoBlock video={videoUrl} className="test-class" />,
    );
    expect(container.firstChild).toHaveClass("videoBlock test-class container");
  });

  it("renders the iframe with the correct src attribute", () => {
    const { getByTitle } = render(<VideoBlock video={videoUrl} />);
    const iframe = getByTitle("YouTube video player");
    expect(iframe).toHaveAttribute("src", videoUrl);
  });

  it("renders the Button component with the correct link and content", () => {
    const { getByText, getByTestId } = render(<VideoBlock video={videoUrl} />);
    const buttonLink = getByText("Video Demo").closest("a");
    expect(buttonLink).toHaveAttribute(
      "href",
      "https://www.youtube.com/watch?v=test-video-id",
    );
    expect(getByTestId("youtube-logo")).toBeInTheDocument();
    expect(getByTestId("youtube-logo")).toHaveAttribute("size", "24");
    expect(getByTestId("youtube-logo")).toHaveAttribute("color", colors.white);
  });
});
