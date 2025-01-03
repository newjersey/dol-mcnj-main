import { ReactNode } from "react";
import { Box } from "./Box";
import { ComponentProps } from "@utils/types";

export interface TooltipProps extends ComponentProps {
  children: ReactNode;
  copy: string;
  style?: React.CSSProperties;
}

export const Tooltip = ({
  children,
  className,
  componentId,
  copy,
  testId,
  style,
}: TooltipProps) => {
  return (
    <span
      id={componentId}
      data-testid={testId}
      className={`popup-tooltip${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
      <Box elementTag="span" radius={5}>
        {copy}
      </Box>
    </span>
  );
};
