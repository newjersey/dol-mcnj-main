import { IconSelector } from "./IconSelector";
import { IconCardProps } from "@utils/types";
import { IconNames } from "@utils/enums";
import { LinkObject } from "./LinkObject";
import * as Svg from "../svgs";
import { capitalizeFirstLetter } from "@utils/capitalizeFirstLetter";
import { Markdown } from "./Markdown";

const CardContent = ({
  centered,
  message,
  icon,
  indicator,
  systemIcon,
  copy,
}: IconCardProps) => {
  const iconName = icon as IconNames;
  const indicatorName = indicator as IconNames;

  const svgName = systemIcon
    ? (`${capitalizeFirstLetter(systemIcon)}${
        centered ? "" : "Bold"
      }` as keyof typeof Svg)
    : undefined;

  return (
    <>
      <div className="icons">
        <span className="icon-container">
          <IconSelector svgName={svgName} name={iconName} size={32} />
        </span>
        {!centered && indicatorName && (
          <span className="icon-container">
            <IconSelector name={indicatorName} size={25} />
          </span>
        )}
      </div>
      <p className="title">{copy}</p>
      {!centered && message && (
        <Markdown className="description" content={message} />
      )}
    </>
  );
};

export const IconCard = (props: IconCardProps) => {
  const { centered, className, fill, hoverFill, theme, url } = props;
  // Constructing the classNames string for the iconCard element based on different conditions
  const classes = `iconCard${theme && !centered ? ` ${theme}` : ""}${
    theme && fill ? ` fill` : ""
  }${centered ? ` centered` : ""}${hoverFill && centered ? " hoverFill" : ""}${
    !url ? " noLink" : ""
  }${className ? ` ${className}` : ""}`;

  return (
    <div className={classes}>
      {url ? (
        <LinkObject url={url} noIndicator>
          <CardContent {...props} />
        </LinkObject>
      ) : (
        <CardContent {...props} />
      )}
    </div>
  );
};
