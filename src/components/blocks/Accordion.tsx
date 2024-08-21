import { AccordionItem } from "@components/modules/AccordionItem";
import { Flex } from "@components/utility/Flex";
import { FaqItem } from "@utils/types";

export interface AccordionProps {
  className?: string;
  items: FaqItem[];
}

export const Accordion = ({ items, className }: AccordionProps) => {
  return (
    <div className={`accordion-block${className ? ` ${className}` : ""}`}>
      <Flex gap="xs" fill direction="column" className="container">
        {items.map((item, index) => (
          <AccordionItem
            key={item.sys.id}
            keyValue={index}
            title={item.question}
            content={item.answer.json}
          />
        ))}
      </Flex>
    </div>
  );
};
