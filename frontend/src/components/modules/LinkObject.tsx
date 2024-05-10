import { Icon } from "@material-ui/core";
import { LinkObjectProps } from "../../types/contentful";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { IconSelector } from "../IconSelector";

export const LinkObject = ({
  children,
  className,
  copy,
  icons,
  iconPrefix,
  onClick,
  iconSuffix,
  iconSize,
  screenReaderOnlyCopy,
  url,
  label,
}: LinkObjectProps) => {
  const isRelative = url.startsWith("/") || url.startsWith("#") || url === "mycareer.nj.gov";
  const isHome = url === "/";
  const target = isRelative ? undefined : "_blank";
  const rel = isRelative ? undefined : "noopener noreferrer";

  return (
    <a
      className={className || undefined}
      href={url}
      aria-label={screenReaderOnlyCopy || copy || label}
      target={target}
      rel={rel}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {iconPrefix && <IconSelector name={iconPrefix} size={iconSize} />}
      <span>
        {copy || children}
        {screenReaderOnlyCopy && <span className="sr-only">{screenReaderOnlyCopy}</span>}
        {isHome && icons ? <Icon>home</Icon> : icons && !isRelative && <ArrowSquareOut />}
      </span>
      {iconSuffix && <IconSelector name={iconSuffix} size={iconSize} />}
    </a>
  );
};
