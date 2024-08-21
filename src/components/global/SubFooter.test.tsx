/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SubFooter } from "./SubFooter";

jest.mock("../svgs", () => ({
  Twitter: () => <svg data-testid="twitter-icon" />,
  YouTube: () => <svg data-testid="youtube-icon" />,
  Facebook: () => <svg data-testid="facebook-icon" />,
  LinkedIn: () => <svg data-testid="linkedin-icon" />,
}));

jest.mock("../modules/ResponsiveImage", () => ({
  ResponsiveImage: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => <img src={src} alt={alt} width={width} height={height} />,
}));

jest.mock("./assets", () => ({
  myNJ: "myNJ-logo.png",
  njoit: "njoit-logo.png",
  opra: "opra-logo.png",
}));

describe("SubFooter Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<SubFooter />);
    expect(container).toBeInTheDocument();
  });

  it("renders OPRA, myNJ, and NJOIT links and images", () => {
    const { getByAltText } = render(<SubFooter />);
    expect(getByAltText("NJ Open Public Records Act")).toBeInTheDocument();
    expect(getByAltText("myNJ Portal Logo")).toBeInTheDocument();
    expect(
      getByAltText("NJ Office of Information Technology"),
    ).toBeInTheDocument();
  });

  it("renders social media links", () => {
    const { getByTestId } = render(<SubFooter />);
    expect(getByTestId("twitter-icon")).toBeInTheDocument();
    expect(getByTestId("facebook-icon")).toBeInTheDocument();
    expect(getByTestId("youtube-icon")).toBeInTheDocument();
    expect(getByTestId("linkedin-icon")).toBeInTheDocument();
  });

  it("opens social media links in a new tab", () => {
    const { getByLabelText } = render(<SubFooter />);
    expect(getByLabelText("Twitter")).toHaveAttribute("target", "_blank");
    expect(getByLabelText("Facebook")).toHaveAttribute("target", "_blank");
    expect(getByLabelText("YouTube")).toHaveAttribute("target", "_blank");
    expect(getByLabelText("LinkedIn")).toHaveAttribute("target", "_blank");
  });

  it("displays the current year", () => {
    const year = new Date().getFullYear();
    const { getByText } = render(<SubFooter />);
    expect(
      getByText(`Copyright © State of New Jersey, 1996-${year}`),
    ).toBeInTheDocument();
  });
});
