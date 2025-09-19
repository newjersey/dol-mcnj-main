"use client";
import * as Icon from "@phosphor-icons/react";
import * as Svg from "@components/svgs";
import { IconWeight } from "@utils/types";

export interface IconSelectorProps {
  className?: string;
  color?: string;
  name?: string;
  size?: number;
  svgName?: keyof typeof Svg;
  weight?: string;
}

export function removeSecondBold(inputString: string): string {
  const regex = /Bold/g;
  const match = inputString.match(regex);

  if (match && match.length >= 2) {
    const indexOfSecondBold = inputString.indexOf("Bold", match[0].length);
    if (indexOfSecondBold !== -1) {
      const firstPart = inputString.slice(0, indexOfSecondBold);
      const secondPart = inputString.slice(indexOfSecondBold + 4);
      return firstPart + secondPart;
    }
  }

  return inputString;
}

export const IconSelector = ({
  className,
  color,
  name,
  size,
  svgName,
  weight = "regular",
}: IconSelectorProps) => {
  let IconComponent: React.ElementType | undefined;

  if (name && Icon[name as keyof typeof Icon]) {
    IconComponent = Icon[name as keyof typeof Icon] as React.ElementType;
  } else if (svgName && Svg[svgName as keyof typeof Svg]) {
    IconComponent = Svg[svgName as keyof typeof Svg] as React.ElementType;
  }

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      className={className}
      color={color}
      size={size}
      weight={weight as IconWeight}
    />
  );
};
