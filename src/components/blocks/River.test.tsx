import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { River } from "./River";
import { RiverItemProps, HeadingLevel } from "../../utils/types";

// Mocking imported components
jest.mock("../modules/Heading", () => ({
  Heading: ({ level, className, children }: any) => (
    <h1 className={className} data-testid="heading" data-level={level}>
      {children}
    </h1>
  ),
}));

jest.mock("../modules/Markdown", () => ({
  Markdown: ({ className, content }: any) => (
    <div className={className} data-testid="markdown">
      {content}
    </div>
  ),
}));

jest.mock("../modules/ResponsiveImage", () => ({
  ResponsiveImage: ({ src, alt }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="responsive-image" />
  ),
}));

jest.mock("../../utils/noOrphans", () => ({
  noOrphans: (text: string) => text,
}));

describe("River Component", () => {
  const items: RiverItemProps[] = [
    {
      sys: { id: "1" },
      image: { sys: { id: "3" }, url: "image1.jpg", height: 200, width: 300 },
      heading: "Heading 1",
      copy: "Copy 1",
    },
    {
      sys: { id: "2" },
      image: { sys: { id: "4" }, url: "image2.jpg", height: 250, width: 350 },
      heading: "Heading 2",
      copy: "Copy 2",
    },
  ];

  it("renders without crashing", () => {
    const { container } = render(<River items={[]} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with items correctly", () => {
    const { getAllByTestId } = render(<River items={items} />);
    expect(getAllByTestId("responsive-image")).toHaveLength(2);
    expect(getAllByTestId("heading")).toHaveLength(2);
    expect(getAllByTestId("markdown")).toHaveLength(2);
  });

  it("applies className correctly", () => {
    const { container } = render(
      <River items={items} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("river custom-class");
  });

  it("applies headingLevel correctly", () => {
    const headingLevel: HeadingLevel = 3;
    const { getAllByTestId } = render(
      <River items={items} headingLevel={headingLevel} />,
    );
    const headings = getAllByTestId("heading");
    headings.forEach((heading) => {
      expect(heading).toHaveAttribute("data-level", headingLevel.toString());
    });
  });

  it("applies default headingLevel when not provided", () => {
    const { getAllByTestId } = render(<River items={items} />);
    const headings = getAllByTestId("heading");
    headings.forEach((heading) => {
      expect(heading).toHaveAttribute("data-level", "2");
    });
  });
});
