import { Info } from "@phosphor-icons/react";
import { toUsCurrency } from "@utils/toUsCurrency";
import { ThemeColors } from "@utils/types";
import { LinkObject } from "./LinkObject";
// import { Tooltip } from '@material-ui/core'

interface InfoBoxProps {
  className?: string;
  copy?: string;
  currency?: boolean;
  eyebrow?: string;
  link?: { url: string; copy: string };
  number?: number;
  theme?: ThemeColors;
  tooltip?: string;
}

const InfoBox = ({
  className,
  copy,
  currency,
  eyebrow,
  link,
  number,
  theme = "orange",
  tooltip,
}: InfoBoxProps) => {
  return (
    <div
      className={`infoBox
      ${className ? className : ""}
      ${theme ? `color-${theme}` : ""}
    `}
    >
      {eyebrow && (
        <p className="eyebrow">
          {eyebrow}
          {tooltip && (
            <>
              <Info weight="fill" size={16} />
            </>
            // <Tooltip title={tooltip} placement="top">
            //   <Info weight="fill" size={16} />
            // </Tooltip>
          )}
        </p>
      )}
      {copy && <p className="copy">{copy}</p>}

      <p className="number">
        {number ? (currency ? toUsCurrency(number) : number) : "--"}
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
