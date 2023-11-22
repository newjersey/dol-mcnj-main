import { useState, ReactElement, useEffect } from "react";
import { Document } from "@contentful/rich-text-types";
import { ContentfulRichText } from "../components/ContentfulRichText";
import { AssetBlock } from "../types/contentful";

export interface AccordionData {
  title: string | ReactElement;
  content: Document;
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

export const Accordion = (data: AccordionData): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const contentId = `a${data.keyValue + 1}`;

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
          <ContentfulRichText
            assets={data.assets}
            document={data.content}
            key={data.keyValue}
            imageDescription
          />
        </div>
      </div>
    </div>
  );
};
