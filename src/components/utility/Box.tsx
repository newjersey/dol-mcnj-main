import { Elements } from "@utils/types";
import { CSSProperties, ReactNode } from "react";

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
