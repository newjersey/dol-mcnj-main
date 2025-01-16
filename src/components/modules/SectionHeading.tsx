import { HeadingLevel, ThemeColors } from "@utils/types";
import { Heading } from "./Heading";

export interface SectionHeadingProps {
  className?: string;
  color?: ThemeColors;
  description?: string;
  heading: string;
  noDivider?: boolean;
  headingLevel?: HeadingLevel;
  strikeThrough?: boolean;
}

const SectionHeading = ({
  className,
  noDivider,
  color,
  description,
  heading,
  headingLevel = 2,
  strikeThrough,
}: SectionHeadingProps) => {
  return (
    <div
      className={`sectionHeading${color ? ` color-${color}` : ""}${
        strikeThrough ? " strikeThrough" : ""
      }${noDivider ? " noDivider" : ""}${className ? ` ${className}` : ""}`}
    >
      <Heading level={headingLevel}>{heading}</Heading>
      {description && <p className="description">{description}</p>}
    </div>
  );
};

export { SectionHeading };
