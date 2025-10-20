import { Elements } from "@utils/types";
import { CSSProperties, ReactNode, JSX } from "react";

interface BoxProps {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  componentId?: string;
  elementTag?: Elements;
  overflow?: boolean;
  radius?: 5 | 10 | 15 | 20;
  role?: string;
  shadow?: 1 | 2 | 3 | 4;
  style?: CSSProperties;
  testId?: string;
}

/**
 * Flexible container component with optional shadow and border radius.
 * 
 * The Box component is a foundational utility component used throughout the application
 * to create consistent spacing, shadows, and rounded corners. Can render as any HTML element.
 * 
 * @param props.children - Content to render inside the box
 * @param props.shadow - Shadow depth (1-4, where 4 is deepest shadow)
 * @param props.radius - Border radius in pixels (5, 10, 15, or 20)
 * @param props.overflow - Whether to hide overflow when radius is applied
 * @param props.elementTag - HTML element to render (default: "div")
 * @param props.className - Additional CSS classes
 * @param props.componentId - HTML id attribute
 * @param props.ariaLabel - Accessibility label
 * @param props.role - ARIA role attribute
 * @param props.style - Inline CSS styles
 * @param props.testId - Test identifier for automated testing
 * 
 * @example
 * ```tsx
 * <Box shadow={2} radius={10}>
 *   <p>Card content here</p>
 * </Box>
 * 
 * <Box elementTag="section" className="hero-section">
 *   <h1>Hero Title</h1>
 * </Box>
 * ```
 */
export const Box = ({
  ariaLabel,
  children,
  className,
  componentId,
  elementTag = "div",
  overflow,
  radius,
  role,
  shadow,
  style,
  testId,
}: BoxProps) => {
  const Element = elementTag as keyof JSX.IntrinsicElements;

  return (
    <Element
      id={componentId}
      role={role}
      aria-label={ariaLabel}
      style={style}
      data-testid={testId}
      className={`mcnj-box${shadow ? ` shadow-${shadow}` : ""}${
        radius ? ` radius-${radius}${overflow ? "-overflow" : ""}` : ""
      }${className ? ` ${className}` : ""}`}
    >
      {children}
    </Element>
  );
};
