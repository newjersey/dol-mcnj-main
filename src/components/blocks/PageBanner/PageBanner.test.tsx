import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PageBanner } from ".";
import { PageBannerProps } from "../../../utils/types";

// Mocking components
jest.mock("../../modules/Breadcrumbs", () => ({
  Breadcrumbs: ({ pageTitle, crumbs }: any) => (
    <nav data-testid="breadcrumbs">
      <span>{pageTitle}</span>
      <ul>
        {crumbs.map((crumb: any, index: number) => (
          <li key={index}>{crumb.copy}</li>
        ))}
      </ul>
    </nav>
  ),
}));

jest.mock("../../modules/ContentfulRichText", () => ({
  ContentfulRichText: ({ document }: any) => (
    <div data-testid="rich-text">{JSON.stringify(document)}</div>
  ),
}));

jest.mock("../../modules/Cta", () => ({
  Cta: ({ heading, links, theme }: any) => (
    <div data-testid="cta">
      <h2>{heading}</h2>
      <div>{theme}</div>
      <div>
        {links.map((link: any) => (
          <a key={link.copy} href={link.url}>
            {link.copy}
          </a>
        ))}
      </div>
    </div>
  ),
}));

jest.mock("../../modules/Heading", () => ({
  Heading: ({ level, children }: any) => (
    <h1 data-testid="heading" data-level={level}>
      {children}
    </h1>
  ),
}));

jest.mock("../../modules/Tag", () => ({
  Tag: ({ title, color }: any) => (
    <div data-testid="tag" className={`tag ${color}`}>
      {title}
    </div>
  ),
}));

jest.mock("../../../utils/createButtonObject", () => ({
  createButtonObject: (link: any) => ({
    ...link,
    type: "link",
  }),
}));

jest.mock("./Highlights", () => ({
  Highlights: ({ items }: any) => (
    <div data-testid="highlights">
      {items.map((item: any, index: number) => (
        <div key={index}>{item.copy}</div>
      ))}
    </div>
  ),
}));

describe("PageBanner Component", () => {
  const props: PageBannerProps = {
    breadcrumbsCollection: {
      items: [{ copy: "Home" }, { copy: "About" }],
    },
    className: "test-class",
    ctaHeading: "CTA Heading",
    ctaLinks: [
      { copy: "Link 1", url: "/link1" },
      { copy: "Link 2", url: "/link2" },
    ],
    eyebrow: "Eyebrow Text",
    finalCrumb: "Final Crumb",
    highlightsCollection: {
      items: [
        {
          sys: { id: "1" },
          copy: "Highlight 1",
          url: "/highlight1",
          value: "Value 1",
        },
        {
          sys: { id: "2" },
          copy: "Highlight 2",
          url: "/highlight2",
          value: "Value 2",
        },
      ],
    },
    inDemand: true,
    infoBlocks: {
      className: "info-block-class",
      ctaLink: { label: "CTA Link", url: "/cta-link" },
      costBlock: {
        copy: "Cost Block",
        number: "1000",
        definition: "Cost Definition",
      },
      rateBlock: {
        copy: "Rate Block",
        number: "5%",
        definition: "Rate Definition",
      },
      titleBlock: {
        copy: "Title Block",
        link: { label: "Title Link", url: "/title-link" },
      },
    },
    message: { json: { content: "Message Content" } },
    subHeading: "Subheading Text",
    theme: "blue",
    title: "Page Title",
  } as any;

  it("renders without crashing", () => {
    const { container } = render(<PageBanner {...props} />);
    expect(container).toBeInTheDocument();
  });

  it("applies className correctly", () => {
    const { container } = render(<PageBanner {...props} />);
    expect(container.firstChild).toHaveClass("pageBanner test-class");
  });

  it("renders Breadcrumbs component with correct props", () => {
    const { getByText, getByTestId } = render(<PageBanner {...props} />);
    const breadcrumbs = getByTestId("breadcrumbs");
    expect(breadcrumbs).toHaveTextContent(props.finalCrumb as string);
    expect(getByText("Home")).toBeInTheDocument();
  });

  it("renders Heading component with correct props", () => {
    const { getAllByTestId } = render(<PageBanner {...props} />);
    const heading = getAllByTestId("heading")[0];
    expect(heading).toHaveTextContent(props.title);
    expect(heading).toHaveAttribute("data-level", "1");
  });

  it("renders Tag component when inDemand is true", () => {
    const { getByTestId } = render(<PageBanner {...props} />);
    const tag = getByTestId("tag");
    expect(tag).toHaveTextContent("In-Demand");
  });

  it("renders ContentfulRichText component with correct props", () => {
    const { getByTestId } = render(<PageBanner {...props} />);
    const richText = getByTestId("rich-text");
    if (typeof props.message === "object" && props.message !== null) {
      expect(richText).toHaveTextContent(JSON.stringify(props.message.json));
    }
  });

  it("renders Cta component with correct props when ctaMode is true", () => {
    const { getByText } = render(
      <PageBanner
        {...props}
        highlightsCollection={undefined}
        infoBlocks={undefined}
      />,
    );
    const cta = getByText(props.ctaHeading as string);
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveTextContent(props.ctaHeading as string);
    props.ctaLinks?.forEach((link) => {
      const linkText = getByText(link.copy as string);
      expect(linkText).toBeInTheDocument();
    });
  });

  it("renders Highlights component with correct props when highlightMode is true", () => {
    const { getByTestId } = render(
      <PageBanner {...props} ctaLinks={undefined} infoBlocks={undefined} />,
    );
    const highlights = getByTestId("highlights");
    expect(highlights).toBeInTheDocument();
    props.highlightsCollection?.items.forEach((item) => {
      expect(highlights).toHaveTextContent(item.copy);
    });
  });

  it("renders InfoBlocks component with correct props when infoMode is true", () => {
    const { getByTestId } = render(
      <PageBanner
        {...props}
        ctaLinks={undefined}
        highlightsCollection={undefined}
      />,
    );
    const infoblocks = document.querySelector(".infoBlocks");
    expect(infoblocks).toBeInTheDocument();
    expect(infoblocks).toHaveTextContent(
      props.infoBlocks?.costBlock?.copy || "",
    );
    expect(infoblocks).toHaveTextContent(
      props.infoBlocks?.rateBlock?.copy || "",
    );
    expect(infoblocks).toHaveTextContent(
      props.infoBlocks?.titleBlock?.copy || "",
    );
  });

  it("renders without optional props", () => {
    const minimalProps = {
      title: "Page Title",
      cards: [
        { sys: { id: "1" }, copy: "Card 1", url: "http://example.com" },
        { sys: { id: "2" }, copy: "Card 2", url: "/internal-link" },
      ],
    };
    const { container } = render(<PageBanner {...minimalProps} />);
    expect(container).toBeInTheDocument();
    expect(container.querySelector(".section-heading")).toBeNull();
  });
});
