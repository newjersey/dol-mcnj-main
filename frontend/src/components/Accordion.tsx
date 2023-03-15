import { useState, ReactElement } from "react";
import { Document } from "@contentful/rich-text-types";
import { ContentfulRichText } from "../components/ContentfulRichText";

interface AccordionData {
  title: string;
  content: Document;
  keyValue: number;
}

export const Accordion = (data: AccordionData): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div key={data.keyValue} className="">
      <h2 className="">
        <button
          onClick={toggleIsOpen}
          onMouseDown={(e): void => e.preventDefault()}
          className=""
          aria-controls={`a${data.keyValue + 1}`}
          aria-expanded={isOpen ? "true" : "false"}
          data-expand={isOpen ? "true" : null}
        >
          {data.title}
        </button>
      </h2>
      <div id={`a${data.keyValue + 1}`} className="" hidden={isOpen ? false : true}>
        <ContentfulRichText document={data.content} key={data.keyValue} />
      </div>
    </div>
  );
};

/*
<div className="accordion-item">
  <div className="accordion-title" onClick={() => setIsOpen(!isOpen)}>
    <div>{title}</div>
    <div>{isOpen ? '-' : '+'}</div>
  </div>
  {isOpen && <div className="accordion-content">{content}</div>}
</div>
*/
