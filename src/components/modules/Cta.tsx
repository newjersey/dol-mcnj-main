import { IconNames } from "@utils/enums";
import { ButtonProps, HeadingLevel, ThemeColors } from "@utils/types";
import { Button } from "./Button";
import { Heading } from "./Heading";
import { themeConverter } from "@utils/themeConverter";

interface CtaProps {
  className?: string;
  heading?: string;
  noIndicator?: boolean;
  headingLevel?: HeadingLevel;
  linkDirection?: "row" | "column";
  links: ButtonProps[];
  theme?: ThemeColors;
}

const Cta = ({
  className,
  heading,
  headingLevel,
  noIndicator,
  linkDirection,
  links,
  theme = "green",
}: CtaProps) => {
  return (
    <div className={`cta${className ? ` ${className}` : ""}`}>
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
        {links.map((button, index: number) => {
          const isExternal = button.link?.startsWith("http");

          return (
            <Button
              {...button}
              key={button.label}
              iconSuffix={
                isExternal ? ("ArrowUpRight" as IconNames) : button.iconSuffix
              }
              defaultStyle={themeConverter(theme)}
              noIndicator={noIndicator}
              className={index > 0 ? "usa-button--outline" : ""}
              type="link"
            />
          );
        })}
      </div>
    </div>
  );
};

export { Cta };
