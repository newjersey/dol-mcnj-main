import { FlexProps } from "@utils/types";
import { Box } from "./Box";

/**
 * Flexbox layout component with responsive behavior and gap spacing.
 * 
 * The Flex component is one of the most-used layout utilities in the application. It wraps
 * CSS flexbox with a consistent API and responsive breakpoints. Automatically converts from
 * row to column layout at specified breakpoints for mobile-first responsive design.
 * 
 * @param props.direction - Flex direction: "row" | "column" (default: "row")
 * @param props.gap - Spacing between items: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" (default: "md")
 * @param props.alignItems - Align items on cross-axis (default: "flex-start")
 * @param props.justifyContent - Align items on main axis (default: "flex-start")
 * @param props.flexWrap - Enable flex wrapping: "wrap" | "nowrap"
 * @param props.columnBreak - Breakpoint to switch to column layout (default: "sm")
 * @param props.noBreak - Disable responsive column break
 * @param props.fill - Make flex container fill available space
 * @param props.children - Child elements to layout
 * @param props.className - Additional CSS classes
 * @param props.customLayout - Custom layout CSS classes
 * @param props.elementTag - HTML element to render (default: "div")
 * 
 * @example
 * ```tsx
 * // Simple horizontal layout with medium gap
 * <Flex gap="md">
 *   <button>Save</button>
 *   <button>Cancel</button>
 * </Flex>
 * 
 * // Responsive card grid that wraps and centers
 * <Flex direction="row" flexWrap="wrap" justifyContent="center" gap="lg">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Flex>
 * 
 * // Column layout that never breaks to row
 * <Flex direction="column" gap="sm" noBreak>
 *   <label>Name</label>
 *   <input />
 * </Flex>
 * ```
 */
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
