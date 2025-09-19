import { HeadingLevel, LinkProps, ThemeColors } from "@utils/types";
import { Heading } from "./Heading";
import { createButtonObject } from "@utils/createButtonObject";
import { Button } from "./Button";

interface ResourceLinkBoxProps {
  className?: string;
  heading?: string;
  headingLevel?: HeadingLevel;
  links: LinkProps[];
  theme?: ThemeColors;
}

const ResourceLinkBox = ({
  className,
  heading,
  headingLevel = 3,
  theme = "blue",
  links,
}: ResourceLinkBoxProps) => {
  return (
    <div
      className={`resourceLinkBox${theme ? ` color-${theme}` : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      <Heading level={headingLevel}>{heading}</Heading>
      <div className="links">
        {links.map((link) => {
          const buttonProps = createButtonObject(link);
          return (
            <Button {...buttonProps} highlight={theme} key={link.sys?.id}>
              {link.copy}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export { ResourceLinkBox };
