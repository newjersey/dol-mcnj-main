import { ReactNode } from "react";
import { Heading, HeadingLevel } from "./Heading";

interface FundingBoxProps {
  className?: string;
  heading?: string;
  children?: ReactNode;
  headingLevel?: HeadingLevel;
  theme?: "info" | "warning" | "error" | "success";
}

const FundingBox = ({
  className,
  heading,
  children,
  theme = "success",
  headingLevel = 3,
}: FundingBoxProps) => {
  return (
    <div className={`fundingBox${className ? ` ${className}` : ""}${theme ? ` ${theme}` : ""}`}>
      {heading && <Heading level={headingLevel}>{heading}</Heading>}
      {children}
    </div>
  );
};

export { FundingBox };
