import { ColumnSize, FlexGridProps } from "@utils/types";
import { Box } from "./Box";

interface GridProps extends FlexGridProps {
  columns?: ColumnSize;
}

export const Grid = ({
  ariaLabel,
  children,
  className,
  columns = 3,
  componentId,
  elementTag = "div",
  gap,
  role,
  style,
  testId,
}: GridProps) => {
  return (
    <Box
      role={role}
      ariaLabel={ariaLabel}
      componentId={componentId}
      elementTag={elementTag}
      style={style}
      className={`wdrlscw-grid gap-${gap} columns-${columns}${className ? ` ${className}` : ""}`}
      testId={testId}
    >
      {children}
    </Box>
  );
};
