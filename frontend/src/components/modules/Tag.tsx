import { IconNames } from "../../types/icons";
import { IconSelector } from "../IconSelector";

interface TagProps {
  chip?: boolean;
  className?: string;
  color: "blue" | "purple" | "green" | "navy" | "orange";
  icon?: string;
  iconSize?: number;
  iconWeight?: "regular" | "bold" | "thin" | "light" | "duotone" | "fill";
  suffix?: boolean;
  title: string;
}

export const Tag = ({
  chip,
  className,
  color,
  icon,
  iconSize = 15,
  iconWeight,
  suffix,
  title,
}: TagProps) => {
  return (
    <span
      className={`tag-item${className ? ` ${className}` : ""}${color ? ` color-${color}` : ""}${
        chip ? ` chip` : ""
      }`}
    >
      {icon && !suffix && (
        <IconSelector weight={iconWeight} name={icon as IconNames} size={iconSize} />
      )}
      {title}
      {icon && suffix && (
        <IconSelector weight={iconWeight} name={icon as IconNames} size={iconSize} />
      )}
    </span>
  );
};
