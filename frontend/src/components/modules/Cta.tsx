import { Button } from "./Button";
import { Heading } from "./Heading";
import { IconNames } from "../../types/icons";
import { LinkObjectProps, ThemeColors } from "../../types/contentful";

interface CtaProps {
  className?: string;
  heading?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  noIndicator?: boolean;
  linkDirection?: "row" | "column";
  links?: LinkObjectProps[];
  theme?: ThemeColors;
}

const Cta = ({
  className,
  heading,
  headingLevel,
  linkDirection,
  noIndicator,
  links,
  theme,
}: CtaProps) => {
  return (
    <div className={`cta${className ? ` ${className}` : ""}${theme ? ` color-${theme}` : ""}`}>
      {heading ? (
        headingLevel ? (
          <Heading className="heading-text" level={headingLevel}>
            {heading}
          </Heading>
        ) : (
          <p className="heading-text">{heading}</p>
        )
      ) : null}
      <div className={`links${linkDirection ? ` ${linkDirection}` : ""}`}>
        {links?.map((link, index: number) => {
          const isExternal = link.url.startsWith("http");
          return (
            <Button
              key={link.sys?.id}
              className={index > 0 ? "usa-button--outline" : ""}
              type="link"
              url={link.url}
              iconPrefix={link.iconPrefix}
              iconSuffix={
                isExternal && !noIndicator ? ("ArrowUpRight" as IconNames) : link.iconSuffix
              }
              svgFill={link.svgFill}
              svgName={link.svgName}
              copy={link.copy}
            />
          );
        })}
      </div>
    </div>
  );
};

export { Cta };
