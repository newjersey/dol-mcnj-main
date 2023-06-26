import { IconNames } from "../../types/icons";
import { IconSelector } from "../IconSelector";

interface TagProps {
  chip?: boolean;
  className?: string;
  color: "blue" | "purple" | "green" | "navy" | "orange";
  icon?: string;
  iconWeight?: "regular" | "bold" | "thin" | "light" | "duotone" | "fill";
  title: string;
}

export const Tag = ({ chip, className, color, icon, iconWeight, title }: TagProps) => {
  return (
    <span
      className={`tag-item${className ? ` ${className}` : ""}${color ? ` color-${color}` : ""}${
        chip ? ` chip` : ""
      }`}
    >
      {icon && <IconSelector weight={iconWeight} name={icon as IconNames} size={15} />}
      {title}
    </span>
  );
};
