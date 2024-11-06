import { IconNames } from "@utils/enums";
import { IconWeight, ThemeColors } from "@utils/types";
import { IconSelector } from "./IconSelector";

export interface TagItemProps {
  chip?: boolean;
  className?: string;
  color: ThemeColors;
  icon?: string;
  iconWeight?: IconWeight;
  small?: boolean;
  suffixIcon?: string;
  title: string;
}

export const Tag = ({
  chip,
  className,
  color,
  icon,
  iconWeight,
  small,
  suffixIcon,
  title,
}: TagItemProps) => {
  return (
    <span
      className={`tag-item${className ? ` ${className}` : ""}${
        color ? ` color-${color}` : ""
      }${chip ? ` chip` : ""}${small ? ` small` : ""}`}
    >
      {icon && (
        <IconSelector weight={iconWeight} name={icon as IconNames} size={15} />
      )}
      {title}
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
