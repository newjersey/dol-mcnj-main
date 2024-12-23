"use client";
import { ThemeColors } from "@utils/types";
import { Heading } from "./Heading";
import { WarningCircle } from "@phosphor-icons/react";

export interface SystemErrorProps {
  className?: string;
  heading: string;
  copy?: string;
  color: ThemeColors;
}

const SystemError = ({ className, heading, copy, color }: SystemErrorProps) => {
  return (
    <div
      className={`systemError${className ? ` ${className}` : ""}${
        color ? ` color-${color}` : ""
      }`}
    >
      <div className="heading">
        <WarningCircle size={64} weight="fill" />
        <Heading level={1}>{heading}</Heading>
      </div>
      {copy && (
        <div
          className="copy"
          dangerouslySetInnerHTML={{
            __html: copy,
          }}
        />
      )}
    </div>
  );
};

export { SystemError };
