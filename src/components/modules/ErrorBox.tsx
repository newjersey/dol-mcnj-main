"use client";
import { Warning } from "@phosphor-icons/react";
import { colors } from "@utils/settings";
import { Heading } from "./Heading";
import { HeadingLevel } from "@utils/types";

interface ErrorBoxProps {
  heading: string;
  copy?: string;
  className?: string;
  headingLevel?: HeadingLevel;
}

const ErrorBox = ({
  heading,
  copy,
  className,
  headingLevel = 3,
}: ErrorBoxProps) => {
  return (
    <div role="alert" className={`errorBox${className ? ` ${className}` : ""}`}>
      <Warning size={64} color={colors.error} />
      <Heading level={headingLevel}>{heading}</Heading>
      {copy && <p>{copy}</p>}
    </div>
  );
};

export { ErrorBox };
