import { HeadingLevel } from "@utils/types";
import { ReactNode } from "react";

export interface HeadingProps {
  children?: ReactNode;
  className?: string;
  level: HeadingLevel;
  html?: {
    __html: string;
  };
}

export const Heading = ({ level, children, className, html }: HeadingProps) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return html ? (
    <HeadingTag
      dangerouslySetInnerHTML={html}
      className={`heading-tag${className ? ` ${className}` : ""}`}
    />
  ) : (
    <HeadingTag className={`heading-tag${className ? ` ${className}` : ""}`}>
      {children}
    </HeadingTag>
  );
};
