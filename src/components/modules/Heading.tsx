import { HeadingLevel } from "@utils/types";
import { ReactNode, JSX } from "react";

export interface HeadingProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  level: HeadingLevel;
  html?: {
    __html: string;
  };
}

export const Heading = ({
  level,
  children,
  id,
  className,
  html,
}: HeadingProps) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return html ? (
    <HeadingTag
      id={id}
      dangerouslySetInnerHTML={html}
      className={`heading-tag${className ? ` ${className}` : ""}`}
    />
  ) : (
    <HeadingTag
      id={id}
      className={`heading-tag${className ? ` ${className}` : ""}`}
    >
      {children}
    </HeadingTag>
  );
};
