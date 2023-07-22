import * as Icon from "@phosphor-icons/react";
import * as Svg from "../svg/Icons";
import { IconNames } from "../types/icons";

export interface IconSelectorProps {
  size?: number;
  name?: string;
  svgName?: keyof typeof Svg;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  color?: string;
}

export const IconSelector = ({ name, svgName, size, color, weight }: IconSelectorProps) => {
  if (svgName) {
    // If svgName is provided, render the corresponding custom SVG component
    const SvgItem = Svg[svgName];
    return <SvgItem size={size} color={color} />;
  }
  if (name) {
    // If name is provided, render the corresponding Phosphor icon component
    const IconItem = Icon[name as IconNames];
    return <IconItem size={size} color={color} weight={weight} />;
  }
  // If neither svgName nor name is provided, return null (no icon to render)
  return null;
};
