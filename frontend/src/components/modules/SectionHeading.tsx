import { Heading } from "./Heading";

interface SectionHeadingProps {
  className?: string;
  description?: string;
  heading: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  strikeThrough?: boolean;
  theme?: "blue" | "green" | "purple" | "navy";
}

const SectionHeading = ({
  className,
  description,
  heading,
  headingLevel = 2,
  strikeThrough,
  theme,
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
