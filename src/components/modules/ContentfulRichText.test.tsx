import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContentfulRichText, Props } from "./ContentfulRichText";
import { BLOCKS } from "@contentful/rich-text-types";

jest.mock("./ResponsiveImage", () => ({
  ResponsiveImage: jest.fn(({ src }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img role="presentation" src={src} alt="" />
  )),
}));

describe("ContentfulRichText Component", () => {
  const document = {
    nodeType: "document",
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        content: [
          {
            nodeType: "text",
            value: "This is a paragraph.",
            marks: [],
            data: {},
          },
        ],
        data: {},
      },
      {
        nodeType: BLOCKS.EMBEDDED_ASSET,
        content: [],
        data: {
          target: {
            sys: { id: "asset-id" },
          },
        },
      },
    ],
  } as any;

  const assets = {
    assets: {
      block: [
        {
          sys: { id: "asset-id" },
          url: "http://example.com/image.jpg",
          width: 800,
          height: 600,
          description: "Image description",
        },
      ],
    },
  };

  const defaultProps: Props = {
    document,
    assets,
    imageDescription: true,
  };

  it("renders without crashing", () => {
    render(<ContentfulRichText {...defaultProps} />);
    expect(screen.getByText("This is a paragraph.")).toBeInTheDocument();
  });

  it("renders paragraphs correctly", () => {
    render(<ContentfulRichText {...defaultProps} />);
    expect(screen.getByText("This is a paragraph.")).toBeInTheDocument();
  });

  it("renders embedded assets correctly", () => {
    render(<ContentfulRichText {...defaultProps} />);
    const image = screen.getByRole("presentation");
    expect(image).toHaveAttribute("src", "http://example.com/image.jpg");
    expect(screen.getByText("Image description")).toBeInTheDocument();
  });

  it("does not render image description when imageDescription is false", () => {
    render(<ContentfulRichText {...defaultProps} imageDescription={false} />);
    expect(screen.queryByText("Image description")).not.toBeInTheDocument();
  });

  it("applies the className correctly", () => {
    render(<ContentfulRichText {...defaultProps} className="custom-class" />);
    expect(screen.getByText("This is a paragraph.").parentElement).toHaveClass(
      "custom-class",
    );
  });

  it("handles missing assets gracefully", () => {
    const documentWithMissingAsset = {
      ...document,
      content: [
        ...document.content,
        {
          nodeType: BLOCKS.EMBEDDED_ASSET,
          content: [],
          data: {
            target: {
              sys: { id: "missing-asset-id" },
            },
          },
        },
      ],
    };

    render(
      <ContentfulRichText
        {...defaultProps}
        document={documentWithMissingAsset}
      />,
    );
    const images = screen.getAllByRole("presentation");
    expect(images.length).toBe(1); // Only the valid asset should be rendered
  });

  it("handles documents with no content gracefully", () => {
    const emptyDocument = {
      nodeType: "document",
      data: {},
      content: [],
    };

    render(
      <ContentfulRichText {...defaultProps} document={emptyDocument as any} />,
    );
    expect(screen.queryByText("This is a paragraph.")).not.toBeInTheDocument();
  });
});
