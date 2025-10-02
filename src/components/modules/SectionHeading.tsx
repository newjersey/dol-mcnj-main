import { HeadingLevel, ThemeColors } from "@utils/types";
import { Heading } from "./Heading";
import { slugify } from "@utils/slugify";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

export interface SectionHeadingProps {
  className?: string;
  color?: ThemeColors;
  description?: string;
  heading: string;
  noDivider?: boolean;
  headingLevel?: HeadingLevel;
  withIds?: boolean;
  strikeThrough?: boolean;
}

const SectionHeading = ({
  className,
  withIds,
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
      <Heading id={withIds ? slugify(heading) : undefined} level={headingLevel}>
        {heading}
      </Heading>
      {description && (
        <span
          className="description text-pretty block"
          dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(description) }}
        />
      )}
    </div>
  );
};

export { SectionHeading };
