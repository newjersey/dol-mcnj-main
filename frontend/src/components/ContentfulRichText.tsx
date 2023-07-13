/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  BLOCKS,
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
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        if (!node.data.target.sys.id) return;

        const currentAsset = assets?.assets.block.find(
          (asset) => asset.sys.id === node.data.target.sys.id
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
