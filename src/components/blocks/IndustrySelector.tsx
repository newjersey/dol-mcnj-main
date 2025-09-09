"use client";
import { Heading } from "@components/modules/Heading";
import { IndustryItem } from "@components/modules/IndustryItem";
import { Flex } from "@components/utility/Flex";
import { IndustrySelectorProps } from "@utils/types/components";
import { OccupationSelector } from "./OccupationSelector";

export const IndustrySelector = ({ items, heading }: IndustrySelectorProps) => {
  return (
    <section className="industrySelector" id="industry-selector">
      <div className="container">
        <div className="inner">
          <Flex direction="column">
            <Heading level={2}>{heading}</Heading>
            <OccupationSelector />
            <Flex fill alignItems="stretch" gap="sm" columnBreak="md">
              {items.map((item) => (
                <IndustryItem key={item.slug} {...item} />
              ))}
            </Flex>
          </Flex>
        </div>
      </div>
    </section>
  );
};
