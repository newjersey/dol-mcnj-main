import { BreakNames, FlexGridProps, FlexProps } from "@utils/types";
import { Box } from "./Box";

export const Flex = ({
  alignItems = "flex-start",
  ariaLabel,
  breakpoint,
  children,
  className,
  columnBreak = "sm",
  componentId,
  customLayout,
  direction = "row",
  elementTag = "div",
  fill,
  flexWrap,
  gap = "md",
  justifyContent = "flex-start",
  noBreak,
  role,
  style,
  testId,
}: FlexProps) => {
  return (
    <Box
      componentId={componentId}
      role={role}
      style={style}
      elementTag={elementTag}
      ariaLabel={ariaLabel}
      className={`mcnj-flex direction-${direction} align-${alignItems}${
        flexWrap ? ` wrap-${flexWrap}` : ""
      } justify-${justifyContent} gap-${gap} column-${
        columnBreak && !noBreak ? columnBreak : ""
      }${className ? ` ${className}` : ""}${
        customLayout ? ` ${customLayout}` : ""
      }${breakpoint && !noBreak ? ` break-${breakpoint}` : ""}${
        fill ? " fill" : ""
      }${noBreak ? " no-break" : ""}`}
      testId={testId}
    >
      {children}
    </Box>
  );
};
