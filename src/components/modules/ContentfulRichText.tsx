import * as React from "react";
import { BLOCKS, Document } from "@contentful/rich-text-types";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { AssetBlock } from "@utils/types";
import { ResponsiveImage } from "./ResponsiveImage";

export type Props = {
  assets?: {
    assets: {
      block: AssetBlock[];
    };
  };
  className?: string;
  document: Document;
  imageDescription?: boolean;
};

export const ContentfulRichText: React.FC<Props> = ({
  assets,
  className,
  document,
  imageDescription,
}: Props) => {
  const options: Options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        if (!node.data.target.sys.id) return;

        const currentAsset = assets?.assets.block.find(
          (asset) => asset.sys.id === node.data.target.sys.id,
        );

        if (!currentAsset) return;

        return (
          <div className="image-text">
            <ResponsiveImage
              noContainer
              src={`${currentAsset.url}`}
              width={currentAsset.width}
              height={currentAsset.height}
            />

            {imageDescription && (
              <div className="description">
                <p>{currentAsset?.description}</p>
              </div>
            )}
          </div>
        );
      },
      [BLOCKS.PARAGRAPH]: (_node, children) => <p>{children}</p>,
    },
  };

  return (
    <div className={className || undefined}>
      {documentToReactComponents(document, options)}
    </div>
  );
};
