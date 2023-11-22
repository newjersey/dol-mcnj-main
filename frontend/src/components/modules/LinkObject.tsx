import { Icon } from "@material-ui/core";
import { LinkObjectProps } from "../../types/contentful";

export const LinkObject = ({
  children,
  className,
  copy,
  icons,
  onClick,
  screenReaderOnlyCopy,
  url,
  label,
}: LinkObjectProps) => {
  const isRelative = url.startsWith("/") || url.startsWith("#");
  const isHome = url === "/";
  const target = isRelative ? undefined : "_blank";
  const rel = isRelative ? undefined : "noopener noreferrer";
  return (
    <a
      href={url}
      target={target}
      rel={rel}
      aria-label={screenReaderOnlyCopy || copy || label}
      className={className || undefined}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      <span>
        {copy || children}
        {screenReaderOnlyCopy && <span className="sr-only">{screenReaderOnlyCopy}</span>}
        {isHome && icons ? <Icon>home</Icon> : icons && !isRelative && <Icon>launch</Icon>}
      </span>
    </a>
  );
};
