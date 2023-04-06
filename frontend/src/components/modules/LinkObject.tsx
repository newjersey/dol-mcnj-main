import { Icon } from "@material-ui/core";
import { LinkObjectProps } from "../../types/contentful";

export const LinkObject = ({
  url,
  copy,
  screenReaderOnlyCopy,
  children,
  icons,
  label,
}: LinkObjectProps) => {
  const isRelative = url.startsWith("/") || url.startsWith("#");
  const isHome = url === "/";
  return (
    <>
      {isRelative ? (
        <a href={url} aria-label={screenReaderOnlyCopy || copy || label}>
          <span>
            {copy || children}
            {screenReaderOnlyCopy && <span className="sr-only">{screenReaderOnlyCopy}</span>}
            {isHome && icons && <Icon>home</Icon>}
          </span>
        </a>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={screenReaderOnlyCopy || copy || label}
        >
          <span>
            {copy || children}
            {screenReaderOnlyCopy && <span className="sr-only">{screenReaderOnlyCopy}</span>}
            {icons && <Icon>launch</Icon>}
          </span>
        </a>
      )}
    </>
  );
};
