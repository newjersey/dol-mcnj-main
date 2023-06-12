import { Heading } from "./Heading";

interface SectionHeadingProps {
  heading: string;
  strikeThrough?: boolean;
  className?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const SectionHeading = ({
  heading,
  className,
  strikeThrough,
  headingLevel = 2,
}: SectionHeadingProps) => {
  return (
    <div
      className={`sectionHeading${strikeThrough ? " strikeThrough" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      <Heading level={headingLevel}>{heading}</Heading>
    </div>
  );
};

export { SectionHeading };
