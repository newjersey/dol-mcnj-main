import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { InfoBlocks } from "./InfoBlocks";
import { LinkProps } from "../../../utils/types";
import { slugify } from "../../../utils/slugify";

describe("InfoBlocks Component", () => {
  const ctaLink: LinkProps = {
    url: "https://example.com",
    copy: "Learn More",
  };

  const costBlock = {
    copy: "Cost",
    number: 100,
    definition: "This is the cost definition.",
  };

  const rateBlock = {
    copy: "Rate",
    number: 5,
    definition: "This is the rate definition.",
  };

  const titleBlock = {
    copy: "Title Block",
    link: {
      url: "https://example.com/title",
      copy: "Title Link",
    },
  };

  it("renders without crashing with default props", () => {
    const { container } = render(<InfoBlocks />);
    expect(container).toBeInTheDocument();
  });

  it("renders with ctaLink prop", () => {
    const { getByText } = render(<InfoBlocks ctaLink={ctaLink} />);
    const ctaButton = getByText(ctaLink.copy as string);
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.parentElement).toHaveAttribute("href", ctaLink.url);
  });

  it("renders with titleBlock prop", () => {
    const { getByText } = render(<InfoBlocks titleBlock={titleBlock} />);
    const titleCopy = getByText(titleBlock.copy);
    expect(titleCopy).toBeInTheDocument();

    const titleLink = getByText(titleBlock.link?.copy as string);
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute("href", titleBlock.link?.url);
  });

  it("renders with multiple props", () => {
    const { getByText, getAllByText } = render(
      <InfoBlocks
        ctaLink={ctaLink}
        costBlock={costBlock}
        rateBlock={rateBlock}
        titleBlock={titleBlock}
      />
    );
    expect(getByText(ctaLink.copy as string)).toBeInTheDocument();
    expect(getAllByText(costBlock.copy)[0]).toBeInTheDocument();
    expect(getAllByText(rateBlock.copy)[0]).toBeInTheDocument();
    expect(getByText(titleBlock.copy)).toBeInTheDocument();
    expect(getByText(titleBlock.link?.copy as string)).toBeInTheDocument();
  });
});
