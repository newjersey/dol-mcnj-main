"use client";
import { ReactNode, useState } from "react";
import { ComponentProps } from "@utils/types";

export interface TooltipProps extends ComponentProps {
  children: ReactNode;
  copy: string;
  style?: React.CSSProperties;
}

export const Tooltip = ({
  children,
  className,
  componentId,
  copy,
  testId,
  style,
}: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      id={componentId}
      data-testid={testId}
      className={`popup-tooltip relative${className ? ` ${className}` : ""}`}
      style={style}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs rounded bg-gray-800 px-3 py-2 text-[14px] text-white leading-[1.2] font-bold shadow-md z-10">
          <div className="absolute left-1/2 top-full -translate-x-1/2">
            <svg
              className="text-gray-800"
              width="12"
              height="6"
              viewBox="0 0 12 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 6L0 0H12L6 6Z" fill="currentColor" />
            </svg>
          </div>
          {copy}
        </div>
      )}
    </span>
  );
};
