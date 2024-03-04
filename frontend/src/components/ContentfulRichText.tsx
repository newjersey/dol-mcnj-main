/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  BLOCKS,
  INLINES
  //, MARKS, Document, Block
} from "@contentful/rich-text-types";
import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";
import { AssetBlock } from "../types/contentful";

export type Props = {
  className?: string;
  imageDescription?: boolean;
  assets?: {
    assets: {
      block: AssetBlock[];
    };
  };
  document: {
    nodeType: BLOCKS.DOCUMENT;
    content: any[];
    data: any;
  };
};

export const ContentfulRichText: React.FC<Props> = ({
  document,
  imageDescription,
  assets,
  className,
}: Props) => {
  const options: Options = {
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => {
        const uri = node.data.uri;
        // Adding a comment to remove
        const newWin = uri?.startsWith('https://www.bls.gov/oes/current/oes_stru.htm');
        return (
          <a href={node.data.uri} rel={newWin ? "noreferrer noopener" : undefined} target={newWin ? "_blank" : undefined}>
            {children}
          </a>
        );
      },
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        if (!node.data.target.sys.id) return;

        const currentAsset = assets?.assets.block.find(
          (asset) => asset.sys.id === node.data.target.sys.id,
        );

        if (!currentAsset) return;

        return (
          <div className="image-text">
            <img src={currentAsset.url} alt={currentAsset?.title} />
            {imageDescription && (
              <div className="description">
                <p>{currentAsset?.description}</p>
              </div>
            )}
          </div>
        );
      },
      [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
    },
  };
  return (
    <div className={className || undefined}>{documentToReactComponents(document, options)}</div>
  );
};
