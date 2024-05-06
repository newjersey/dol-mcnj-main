import { ReactNode } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  level: HeadingLevel;
  children: ReactNode;
  className?: string;
}

export const Heading = ({ level, children, className }: HeadingProps) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className={`heading-tag ${className ? ` ${className}` : ""}`}>
      {children}
    </HeadingTag>
  );
};
