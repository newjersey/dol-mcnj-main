import { ReactNode } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  level: HeadingLevel;
  children: ReactNode;
  className?: string;
}

export const Heading = ({ level, children, className }: HeadingProps) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

  return <HeadingTag className={className}>{children}</HeadingTag>;
};
