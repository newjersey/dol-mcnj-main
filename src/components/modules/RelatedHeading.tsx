"use client";
import { HeadingLevel } from "@utils/types";
import { Heading } from "./Heading";
import { LinkObject } from "./LinkObject";
import { CaretRight } from "@phosphor-icons/react";

interface RelatedHeadingProps {
  className?: string;
  title: string;
  headingLevel?: HeadingLevel;
  hasTraining?: boolean;
}

const RelatedHeading = ({
  className,
  title,
  hasTraining,
  headingLevel = 2,
}: RelatedHeadingProps) => {
  return (
    <Heading
      level={headingLevel}
      className={`relatedHeading${className ? ` ${className}` : ""}`}
    >
      Related Training
      {hasTraining && (
        <LinkObject url={`/training/search?q=${title}`}>
          See More Results <CaretRight size={16} />
        </LinkObject>
      )}
    </Heading>
  );
};

export { RelatedHeading };
