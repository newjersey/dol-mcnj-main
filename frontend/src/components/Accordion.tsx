import { useState, ReactElement, useEffect } from "react";
import { Document } from "@contentful/rich-text-types";
import { ContentfulRichText } from "../components/ContentfulRichText";

export interface AccordionData {
  title: string | ReactElement;
  content: Document;
  keyValue: number;
  open?: boolean;
}

export const Accordion = (data: AccordionData): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const contentId = `a${data.keyValue + 1}`;
  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
    const contentBlock = document.getElementById(contentId);
    if (contentBlock) {
      const height = contentBlock?.scrollHeight;
      contentBlock.style.height = !isOpen ? `${height}px` : "0px";
    }
  };

  useEffect(() => {
    if (data.open) {
      toggleIsOpen();
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
        onClick={toggleIsOpen}
        onMouseDown={(e): void => e.preventDefault()}
        aria-controls={contentId}
        aria-expanded={isOpen ? "true" : "false"}
        data-expand={isOpen ? "true" : null}
      >
        {data.title}
      </button>

      <div id={contentId} className="content" data-testid="accordion-content">
        <div className="inner">
          <ContentfulRichText document={data.content} key={data.keyValue} />
        </div>
      </div>
    </div>
  );
};
