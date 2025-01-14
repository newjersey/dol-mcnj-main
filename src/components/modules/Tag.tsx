import { IconNames } from "@utils/enums";
import { IconWeight, ThemeColors } from "@utils/types";
import { IconSelector } from "./IconSelector";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

export interface TagItemProps {
  chip?: boolean;
  className?: string;
  color: ThemeColors;
  icon?: string;
  markdown?: boolean;
  iconWeight?: IconWeight;
  small?: boolean;
  suffixIcon?: string;
  title: string;
  tooltip?: string;
}

export const Tag = ({
  chip,
  className,
  color,
  icon,
  tooltip,
  iconWeight,
  markdown,
  small,
  suffixIcon,
  title,
}: TagItemProps) => {
  const Element = (tooltip ? "button" : "span") as keyof JSX.IntrinsicElements;

  return (
    <Element
      className={`tag-item${className ? ` ${className}` : ""}${
        color ? ` color-${color}` : ""
      }${chip ? ` chip` : ""}${small ? ` small` : ""}${
        tooltip ? ` usa-tooltip` : ""
      }`}
      title={tooltip}
      data-position="top"
    >
      {icon && (
        <IconSelector weight={iconWeight} name={icon as IconNames} size={15} />
      )}
      {markdown ? (
        <span
          dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(title) }}
        />
      ) : (
        <>{title}</>
      )}

      {suffixIcon && (
        <IconSelector
          weight={iconWeight}
          name={suffixIcon as IconNames}
          size={15}
        />
      )}
    </Element>
  );
};
