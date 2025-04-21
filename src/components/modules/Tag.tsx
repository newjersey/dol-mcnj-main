"use client";
import { IconNames } from "@utils/enums";
import { IconWeight, ThemeColors } from "@utils/types";
import { IconSelector } from "./IconSelector";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { useState } from "react";

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
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      className={`tag-item relative${className ? ` ${className}` : ""}${
        color ? ` color-${color}` : ""
      }${chip ? ` chip` : ""}${small ? ` small` : ""}`}
      onMouseEnter={() => {
        if (tooltip) {
          setShowTooltip(true);
        }
      }}
      onMouseLeave={() => {
        if (tooltip) {
          setShowTooltip(false);
        }
      }}
      onFocus={() => {
        if (tooltip) {
          setShowTooltip(true);
        }
      }}
      onBlur={() => {
        if (tooltip) {
          setShowTooltip(false);
        }
      }}
    >
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs rounded bg-gray-800 px-3 py-2 text-[14px] text-white leading-[1.2] font-bold shadow-md z-10">
          <div className="absolute left-1/2 top-full -translate-x-1/2">
            <svg
              className="text-gray-800"
              width="12"
              height="6"
              viewBox="0 0 12 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 6L0 0H12L6 6Z" fill="currentColor" />
            </svg>
          </div>
          {tooltip}
        </div>
      )}
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
    </span>
  );
};
