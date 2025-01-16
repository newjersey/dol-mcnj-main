"use client";
import { Cta } from "@components/modules/Cta";
import {
  ButtonProps,
  HeadingLevel,
  LinkProps,
  ThemeColors,
} from "@utils/types";
import { Heading } from "@components/modules/Heading";
import { Button } from "@components/modules/Button";
import { createButtonObject } from "@utils/createButtonObject";

export interface CtaBannerProps {
  className?: string;
  contained?: boolean;
  fullColor?: boolean;
  headingLevel?: HeadingLevel;
  inlineButtons?: boolean;
  noIndicator?: boolean;
  customLinks?: ButtonProps[];
  theme?: ThemeColors;
  heading?: string;
  items?: LinkProps[];
  subHeading?: string;
}
const CtaBanner = ({
  className,
  contained,
  fullColor,
  heading,
  customLinks,
  headingLevel = 3,
  inlineButtons,
  items,
  noIndicator,
  theme = "blue",
}: CtaBannerProps) => {
  const buttonLinks = items?.map((link) => {
    return createButtonObject(link);
  });

  const linkArray =
    process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "true"
      ? buttonLinks
      : buttonLinks?.filter((link) => link.label !== "NJ Career Pathways");

  const customLinkArray =
    process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "true"
      ? customLinks
      : customLinks?.filter((link) => link.label !== "NJ Career Pathways");

  return (
    <section
      className={`ctaBanner${className ? ` ${className}` : ""}${
        theme ? ` color-${theme}` : ""
      }${fullColor ? " fullColor" : ""}${
        contained && fullColor ? " contained" : ""
      }`}
    >
      {fullColor ? (
        <div className="container">
          <Heading className="heading" level={headingLevel}>
            {heading}
          </Heading>

          {(customLinkArray || items) && (
            <div className="links">
              {(customLinkArray || linkArray)?.map((button) => {
                return (
                  <Button
                    key={button.label}
                    {...button}
                    className={`link${
                      button.className ? ` ${button.className}` : ""
                    }`}
                    type="link"
                    noIndicator={noIndicator}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <Cta
          noIndicator={noIndicator}
          theme={theme}
          heading={heading}
          linkDirection={inlineButtons ? "row" : "column"}
          headingLevel={headingLevel}
          links={linkArray || []}
        />
      )}
    </section>
  );
};

export { CtaBanner };
