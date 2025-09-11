import { Info } from "@phosphor-icons/react";
import { toUsCurrency } from "@utils/toUsCurrency";
import { ThemeColors } from "@utils/types";
import { LinkObject } from "./LinkObject";
import { Spinner } from "./Spinner";
import { Tooltip } from "react-tooltip";
import { slugify } from "@utils/slugify";

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
  return (
    <div
      className={`infoBox${className ? ` ${className}` : ""}${
        theme ? ` color-${theme}` : ""
      }`}
    >
      {eyebrow && (
        <div className="eyebrow">
          <p className="m-0">{eyebrow}</p>
          {tooltip && (
            <span>
              <Tooltip
                id={slugify(eyebrow)}
                className="custom-tooltip"
                place="top"
              >
                <div className="max-w-[250px] text-pretty">{tooltip}</div>
              </Tooltip>
              <Info
                data-tooltip-id={slugify(eyebrow)}
                weight="fill"
                size={16}
              />
            </span>
          )}
        </div>
      )}
      {copy && <p className="copy">{copy}test</p>}

      <p className="number">
        {loading ? (
          <Spinner
            style={{ margin: "5px 0", justifyContent: "flex-start" }}
            size={20}
          />
        ) : (
          <>
            {number !== null && typeof number !== "undefined" ? (
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
