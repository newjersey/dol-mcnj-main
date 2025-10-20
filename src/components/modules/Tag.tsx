import { IconWeight, ThemeColors } from "@utils/types";
import { IconSelector } from "./IconSelector";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { JSX } from "react";

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

/**
 * Tag/badge component for displaying labels, statuses, and categories.
 * 
 * Used extensively throughout the app for "In-Demand" badges, filter chips,
 * status indicators, and feature labels. Supports icons, tooltips, and markdown.
 * 
 * @param props.title - Text to display in the tag (required)
 * @param props.color - Theme color (e.g., "primary", "success", "warning")
 * @param props.chip - Whether to style as a removable chip
 * @param props.icon - Icon name to display before title (Phosphor icon name)
 * @param props.suffixIcon - Icon name to display after title
 * @param props.iconWeight - Icon weight: "thin" | "light" | "regular" | "bold" | "fill"
 * @param props.small - Whether to use small size variant
 * @param props.markdown - Whether to parse title as markdown
 * @param props.tooltip - Tooltip text to show on hover (makes tag a button)
 * @param props.className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * // In-demand badge
 * <Tag title="In-Demand" color="success" icon="TrendUp" small />
 * 
 * // Filter chip
 * <Tag title="Bergen County" color="primary" chip suffixIcon="X" />
 * 
 * // Status with tooltip
 * <Tag title="Online" color="info" icon="Desktop" tooltip="Available online" />
 * ```
 */
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
      {icon && <IconSelector weight={iconWeight} name={icon} size={15} />}
      {markdown ? (
        <span
          dangerouslySetInnerHTML={{
            __html: parseMarkdownToHTML(title),
          }}
        />
      ) : (
        <>{title}</>
      )}

      {suffixIcon && (
        <IconSelector weight={iconWeight} name={suffixIcon} size={15} />
      )}
    </Element>
  );
};
