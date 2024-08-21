import { capitalizeFirstLetter } from "@utils/capitalizeFirstLetter";
import { ButtonProps, LinkProps, ThemeColors } from "./types";
import * as Svg from "../components/svgs";
import * as Icons from "@phosphor-icons/react";

export const createButtonObject = (
  link: LinkProps,
  button?: {
    buttonId?: string;
    className?: string;
    customBgColor?: string;
    customBorderColor?: string;
    customTextColor?: string;
    fontColor?: string;
    highlight?: ThemeColors;
    iconPrefix?: string;
    iconSuffix?: string;
    iconWeight?: string;
    svgName?: keyof typeof Svg;
    info?: boolean;
    link?: string;
    onClick?: () => void;
    svgFill?: boolean;
    type?: "button" | "link";
    unstyled?: boolean;
  },
): ButtonProps => {
  return {
    iconPrefix:
      (button?.iconPrefix as keyof typeof Icons) ||
      (link.icon as keyof typeof Icons),
    className: button?.className,
    link: link.url,
    label: `${link.copy}`,
    svgName:
      button?.svgName ||
      (capitalizeFirstLetter(link.systemIcon) as keyof typeof Svg),
    type: button?.type || "link",
    highlight: button?.highlight,
    iconSuffix: button?.iconSuffix as keyof typeof Icons,
    customBgColor: button?.customBgColor,
    customBorderColor: button?.customBorderColor,
    customTextColor: button?.customTextColor,
    fontColor: button?.fontColor,
    iconWeight: button?.iconWeight,
    info: button?.info,
  };
};
