import { Info } from "@phosphor-icons/react";
import { toUsCurrency } from "@utils/toUsCurrency";
import { ThemeColors } from "@utils/types";
import { LinkObject } from "./LinkObject";
import { Spinner } from "./Spinner";

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
      className={`infoBox${className ? ` ${className}` : ""}${theme ? ` color-${theme}` : ""}`}
    >
      {eyebrow && (
        <p className="eyebrow">
          {eyebrow}
          {tooltip && (
            <>
              <button
                type="button"
                className="unstyled usa-tooltip"
                data-position="top"
                title={tooltip}
              >
                <Info weight="fill" size={16} />
              </button>
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
