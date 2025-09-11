import { AccordionItem } from "@components/modules/AccordionItem";
import { Flex } from "@components/utility/Flex";
import { ContentfulRichTextProps, FaqItem } from "@utils/types";

export interface AccordionProps {
  className?: string;
  items: FaqItem[];
}

export const Accordion = ({ items, className }: AccordionProps) => {
  return (
    <div className={`accordion-block${className ? ` ${className}` : ""}`}>
      <Flex gap="xs" fill direction="column" className="container">
        {items.map((item, index) => {
          const isString = typeof item.answer === "string";

          return (
            <AccordionItem
              key={item.question}
              keyValue={index}
              title={item.question}
              content={
                isString
                  ? item.answer
                  : (item.answer as ContentfulRichTextProps).json
              }
            />
          );
        })}
      </Flex>
    </div>
  );
};
