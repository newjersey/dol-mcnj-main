'use client";';
import { Info } from "@phosphor-icons/react";
import { toUsCurrency } from "@utils/toUsCurrency";
import { ThemeColors } from "@utils/types";
import { LinkObject } from "./LinkObject";
import { Spinner } from "./Spinner";
import { useState } from "react";

interface InfoBoxProps {
  className?: string;
  copy?: string;
  currency?: boolean;
  eyebrow?: string;
  link?: { url: string; copy: string };
  loading?: boolean;
  notAvailableText: string;
  number?: number;
  numberEnd?: number;
  theme?: ThemeColors;
  tooltip?: string;
}

const InfoBox = ({
  className,
  copy,
  currency,
  eyebrow,
  link,
  loading,
  notAvailableText,
  number,
  numberEnd,
  theme = "orange",
  tooltip,
}: InfoBoxProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div
      className={`infoBox${className ? ` ${className}` : ""}${
        theme ? ` color-${theme}` : ""
      }`}
    >
      {eyebrow && (
        <p className="eyebrow relative">
          {eyebrow}
          {tooltip && (
            <>
              <span
                className="custom-tooltip relative"
                data-position="top"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                title={tooltip}
              >
                <Info weight="fill" size={16} />
                {showTooltip && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs rounded bg-gray-800 px-3 py-2 text-[14px] leading-[1.2] text-white font-bold shadow-md z-10">
                    <span className="absolute left-1/2 top-full -translate-x-1/2">
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
                    </span>
                    {tooltip}
                  </span>
                )}
              </span>
            </>
          )}
        </p>
      )}
      {copy && <p className="copy">{copy}</p>}

      <p className="number">
        {loading ? (
          <Spinner
            style={{ margin: "5px 0", justifyContent: "flex-start" }}
            size={20}
          />
        ) : (
          <>
            {number ? (
              currency ? (
                <>
                  {toUsCurrency(number)}
                  {numberEnd ? ` - ${toUsCurrency(Number(numberEnd))}` : ""}
                </>
              ) : (
                number
              )
            ) : (
              notAvailableText
            )}
          </>
        )}
      </p>

      {link?.url && (
        <LinkObject url={link.url} className="link">
          {link.copy}
        </LinkObject>
      )}
    </div>
  );
};

export { InfoBox };
