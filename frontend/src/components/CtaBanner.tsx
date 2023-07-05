import { LinkObjectProps, ThemeColors } from "../types/contentful";
import { Heading } from "./modules/Heading";
import { Button } from "./modules/Button";
import { Cta } from "./modules/Cta";
import { IconNames } from "../types/icons";

interface CtaBannerProps {
  className?: string;
  contained?: boolean;
  fullColor?: boolean;
  heading?: string;
  noIndicator?: boolean;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  links?: LinkObjectProps[];
  theme?: ThemeColors;
}
const CtaBanner = ({
  className,
  contained,
  fullColor,
  heading,
  noIndicator,
  headingLevel = 3,
  links,
  theme = "navy",
}: CtaBannerProps) => {
  return (
    <section
      className={`ctaBanner${className ? ` ${className}` : ""}${theme ? ` color-${theme}` : ""}${
        fullColor ? " fullColor" : ""
      }${contained && fullColor ? " contained" : ""}`}
    >
      {fullColor ? (
        <div className="container">
          {heading && (
            <Heading className="heading" level={headingLevel}>
              {heading}
            </Heading>
          )}
          <div className="links">
            {links?.map((link) => {
              const isExternal = link.url.startsWith("http");
              return (
                <Button
                  type="link"
                  key={link.sys?.id}
                  className="link"
                  iconPrefix={link.iconPrefix}
                  iconSuffix={isExternal ? ("ArrowUpRight" as IconNames) : link.iconSuffix}
                  svgFill={link.svgFill}
                  highlight={link.highlight}
                  svgName={link.svgName}
                  url={link.url}
                  copy={link.copy}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <Cta
          theme={theme}
          heading={heading}
          headingLevel={headingLevel}
          links={links}
          noIndicator={noIndicator}
        />
      )}
    </section>
  );
};

export { CtaBanner };
