import { LinkObjectProps, ThemeColors } from "../../types/contentful";
import { Heading } from "./Heading";

interface CtaProps {
  className?: string;
  heading?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  linkDirection?: "row" | "column";
  links: LinkObjectProps[];
  theme?: ThemeColors;
}

const Cta = ({ className, heading, headingLevel, linkDirection, links, theme }: CtaProps) => {
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
          const target = isExternal ? "_blank" : undefined;
          const rel = isExternal ? "noopener noreferrer" : undefined;
          return (
            <a
              key={link.sys?.id}
              className={`usa-button usa-button--secondary${
                index > 0 ? "usa-button--outline" : ""
              }`}
              target={target}
              rel={rel}
              href={link.url}
            >
              {link.copy}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export { Cta };
