import { IconSelector } from "./IconSelector";
import { IconCardProps, IconNames } from "../types/icons";

export const IconCard = ({
  centered,
  description,
  icon,
  theme,
  large,
  className,
  indicator,
  fill,
  svg,
  iconWeight,
  title,
  url,
}: IconCardProps) => {
  // Constructing the classNames string for the iconCard element based on different conditions
  const classes = `iconCard${theme && !centered ? ` ${theme}` : ""}${theme && fill ? ` fill` : ""}${
    centered ? ` centered` : ""
  }${large && centered ? " large" : ""}${className ? ` ${className}` : ""}`;

  const iconName = icon as IconNames;
  const indicatorName = indicator as IconNames;

  const isExternal = url.includes("http");
  const linkTarget = isExternal ? "_blank" : undefined;
  const linkRel = isExternal ? "noopener noreferrer" : undefined;

  return (
    <div className={classes}>
      <a
        href={url}
        onClick={(e) => {
          e.preventDefault();
          // smooth scroll to element with id if the link starts with a hash
          if (url.startsWith("#")) {
            const element = document.getElementById(url.substring(1));
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }
        }}
        target={linkTarget}
        rel={linkRel}
      >
        <div className="icons">
          <span className="icon-container">
            <IconSelector weight={iconWeight} svgName={svg} name={iconName} size={32} />
          </span>
          {!centered && indicatorName && (
            <span className="icon-container">
              <IconSelector weight={iconWeight} name={indicatorName} size={25} />
            </span>
          )}
        </div>
        <p className="title">{title}</p>
        {!centered && description && <p className="description">{description}</p>}
      </a>
    </div>
  );
};
