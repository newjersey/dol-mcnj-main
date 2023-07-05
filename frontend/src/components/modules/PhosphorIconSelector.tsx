import { ComponentType } from "react";
import * as Icon from "@phosphor-icons/react";
import { IconNames } from "../../types/icons";

export const PhosphorIconSelector = ({
  name,
  color,
  size,
}: {
  name: IconNames;
  color?: string;
  size?: number;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent: ComponentType<any> = Icon[name];
  return <IconComponent color={color} size={size} />;
};
