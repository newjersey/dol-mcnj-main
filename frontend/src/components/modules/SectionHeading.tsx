import { Heading } from "./Heading";

interface SectionHeadingProps {
  heading: string;
  theme?: "blue" | "green" | "purple" | "navy";
  strikeThrough?: boolean;
  className?: string;
  description?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const SectionHeading = ({
  heading,
  className,
  strikeThrough,
  headingLevel = 2,
  theme,
  description,
}: SectionHeadingProps) => {
  return (
    <div
      className={`sectionHeading${strikeThrough ? " strikeThrough" : ""}${
        className ? ` ${className}` : ""
      }${theme ? ` color-${theme}` : ""}`}
    >
      <Heading level={headingLevel}>{heading}</Heading>
      {description && <p className="description">{description}</p>}
    </div>
  );
};

export { SectionHeading };
