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

const headingClasses =
  "heading-text text-ink text-[20.8px] tabletLg:text-[28px] font-bold mx-auto mb-[16px] leading-[1.2]";

const Cta = ({
  className,
  heading,
  headingLevel,
  noIndicator,
  linkDirection,
  links,
  theme,
}: CtaProps) => {
  return (
    <div
      className={`cta text-center px-[16px] py-[32px]${
        className ? ` ${className}` : ""
      }`}
    >
      {heading ? (
        headingLevel ? (
          <Heading className={headingClasses} level={headingLevel}>
            {heading}
          </Heading>
        ) : (
          <p className={headingClasses}>{heading}</p>
        )
      ) : null}

      <div
        className={`links flex items-center gap-[16px]${
          linkDirection === "column"
            ? ` flex-col mobile:flex-row justify-center`
            : " flex-row justify-center"
        }`}
      >
        {links.map((button, index: number) => {
          const isExternal = button.link?.startsWith("http");

          return (
            <Button
              {...button}
              key={button.label}
              iconSuffix={
                isExternal ? ("ArrowSquareOut" as IconNames) : button.iconSuffix
              }
              defaultStyle={theme ? themeConverter(theme) : button.defaultStyle}
              noIndicator={noIndicator}
              className={`flex items-center justify-center w-full${
                index > 0 ? " usa-button--outline" : ""
              }${linkDirection === "row" ? " w-auto min-w-[140px]" : ""}`}
              type="link"
            />
          );
        })}
      </div>
    </div>
  );
};

export { Cta };
