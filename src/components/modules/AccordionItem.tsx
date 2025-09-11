"use client";
import { useState, ReactElement, useEffect } from "react";
import { Document } from "@contentful/rich-text-types";
import { ContentfulRichText } from "./ContentfulRichText";
import { AssetBlock } from "@utils/types";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

export interface AccordionItemProps {
  title: string | ReactElement;
  content: string | Document;
  assets?: {
    assets: {
      block: AssetBlock[];
    };
  };
  keyValue: number;
  open?: boolean;
}

const toggleOpen = (isOpen: boolean, contentId: string): void => {
  const contentBlock = document.getElementById(contentId);
  if (contentBlock) {
    const height = contentBlock?.scrollHeight;
    contentBlock.style.height = !isOpen ? `${height}px` : "0px";
  }
};

export const AccordionItem = (data: AccordionItemProps): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const contentId = `a${data.keyValue + 1}`;

  const isString = typeof data.content === "string";

  useEffect(() => {
    if (data.open) {
      setIsOpen(!isOpen);
      toggleOpen(isOpen, contentId);
    }
  }, []);

  return (
    <div
      key={data.keyValue}
      data-testid="accordion"
      className={`accordion ${isOpen ? "open" : "closed"}`}
    >
      <button
        data-testid="accordion-button"
        onClick={() => {
          setIsOpen(!isOpen);
          toggleOpen(isOpen, contentId);
        }}
        type="button"
        onMouseDown={(e): void => e.preventDefault()}
        aria-controls={contentId}
        aria-expanded={isOpen ? "true" : "false"}
        data-expand={isOpen ? "true" : null}
      >
        {data.title}
      </button>

      <div id={contentId} className="content" data-testid="accordion-content">
        <div className="inner">
          {isString ? (
            <div
              dangerouslySetInnerHTML={{
                __html: parseMarkdownToHTML(data.content as string),
              }}
            />
          ) : (
            <ContentfulRichText
              assets={data.assets}
              document={data.content as Document}
              key={data.keyValue}
              imageDescription
            />
          )}
        </div>
      </div>
    </div>
  );
};
