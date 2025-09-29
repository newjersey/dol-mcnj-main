"use client";
import { Heading } from "@components/modules/Heading";
import { IndustryItem } from "@components/modules/IndustryItem";
import { Flex } from "@components/utility/Flex";
import { IndustrySelectorProps } from "@utils/types/components";
import { OccupationCombobox } from "./OccupationCombobox";
export const IndustrySelector = ({
  items,
  heading,
  secondaryHeading,
}: IndustrySelectorProps) => {
  return (
    <section className="industrySelector" id="industry-selector">
      <div className="container">
        <div className="inner">
          <Flex direction="column">
            <Heading level={2}>{heading}</Heading>
            <OccupationCombobox />
            <div className="or-divider">
              <span>or</span>
            </div>
            <Heading level={3}>{secondaryHeading}</Heading>
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
