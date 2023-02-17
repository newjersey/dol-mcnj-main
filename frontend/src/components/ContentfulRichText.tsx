/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  BLOCKS,
  //, MARKS, Document, Block
} from "@contentful/rich-text-types";
import { documentToReactComponents, Options } from "@contentful/rich-text-react-renderer";

export type Props = {
  document: {
    nodeType: BLOCKS.DOCUMENT;
    content: any[];
    data: any;
  };
};

function getObjectKeyArray(obj: any): string[] {
  if (typeof obj !== "object") return [];
  const arr: string[] = [];
  for (const key in obj) {
    arr.push(key);
  }
  return arr;
}

export const ContentfulRichText: React.FC<Props> = ({ document }: Props) => {
  const options: Options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        if (!node.data.target.fields) return;
        const { file, description } = node.data.target.fields;
        const locales = getObjectKeyArray(file);
        return locales.map((locale) => (
          <img src={file[locale].url} alt={description[locale]} data-locale={locale} key={locale} />
        ));
      },
    },
  };
  return <div>{documentToReactComponents(document, options)}</div>;
};
