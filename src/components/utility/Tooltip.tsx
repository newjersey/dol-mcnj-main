import { ReactNode } from "react";
import { Box } from "./Box";
import { ComponentProps } from "@utils/types";

export interface TooltipProps extends ComponentProps {
  children: ReactNode;
  copy: string;
}

export const Tooltip = ({
  children,
  className,
  componentId,
  copy,
  testId,
}: TooltipProps) => {
  return (
    <span
      id={componentId}
      data-testid={testId}
      className={`popup-tooltip${className ? ` ${className}` : ""}`}
    >
      {children}
      <Box elementTag="span" radius={5}>
        {copy}
      </Box>
    </span>
  );
};
