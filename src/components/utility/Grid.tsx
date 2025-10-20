import { ColumnSize, FlexGridProps } from "@utils/types";
import { Box } from "./Box";

interface GridProps extends FlexGridProps {
  columns?: ColumnSize;
}

/**
 * CSS Grid layout component with configurable columns and gap spacing.
 * 
 * Provides a simple grid layout system for cards, images, or any content that needs
 * equal-width columns. Uses CSS Grid under the hood with responsive behavior.
 * 
 * @param props.columns - Number of columns: 1 | 2 | 3 | 4 | 5 | 6 (default: 3)
 * @param props.gap - Spacing between grid items: "xxs" | "xs" | "sm" | "md" | "lg" | "xl"
 * @param props.children - Child elements to arrange in grid
 * @param props.className - Additional CSS classes
 * @param props.elementTag - HTML element to render (default: "div")
 * @param props.componentId - HTML id attribute
 * @param props.ariaLabel - Accessibility label
 * @param props.role - ARIA role attribute
 * @param props.style - Inline CSS styles
 * @param props.testId - Test identifier
 * 
 * @example
 * ```tsx
 * // Three-column card grid
 * <Grid columns={3} gap="lg">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 * 
 * // Two-column layout with small gap
 * <Grid columns={2} gap="sm">
 *   <div>Left content</div>
 *   <div>Right content</div>
 * </Grid>
 * ```
 */
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
      className={`mcnj-grid gap-${gap} columns-${columns}${className ? ` ${className}` : ""}`}
      testId={testId}
    >
      {children}
    </Box>
  );
};
