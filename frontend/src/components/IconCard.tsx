import { IconSelector } from "./IconSelector";
import { IconCardProps, IconNames } from "../types/icons";
import { LinkObject } from "./modules/LinkObject";

const CardContent = ({
  centered,
  description,
  icon,
  svg,
  iconWeight,
  indicator,
  title,
}: IconCardProps) => {
  const iconName = icon as IconNames;
  const indicatorName = indicator as IconNames;
  return (
    <>
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
      {title && <p className="title">{title}</p>}
      {!centered && description && <p className="description">{description}</p>}
    </>
  );
};

export const IconCard = (props: IconCardProps) => {
  const { centered, theme, large, className, fill, url } = props;
  // Constructing the classNames string for the iconCard element based on different conditions
  const classes = `iconCard${theme && !centered ? ` ${theme}` : ""}${theme && fill ? ` fill` : ""}${
    centered ? ` centered` : ""
  }${large && centered ? " large" : ""}${!url ? " noLink" : ""}${className ? ` ${className}` : ""}`;

  const isExternal = url?.includes("http");
  const linkTarget = isExternal ? "_blank" : undefined;
  const linkRel = isExternal ? "noopener noreferrer" : undefined;

  return (
    <div className={classes}>
      {url ? (
        <a
          href={url}
          onClick={(e) => {
            // smooth scroll to element with id if the link starts with a hash
            if (url.startsWith("#")) {
              e.preventDefault();
              const element = document.getElementById(url.substring(1));
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }
          }}
          target={linkTarget}
          rel={linkRel}
        >
          <CardContent {...props} />
        </a>
      ) : (
        <CardContent {...props} />
      )}
    </div>
  );
};
