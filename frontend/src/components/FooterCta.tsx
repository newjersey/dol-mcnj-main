import { HeadingLevel, LinkObjectProps } from "../types/contentful";
import { Heading } from "./modules/Heading";

export const FooterCta = ({
  heading,
  headingLevel = 3,
  link,
}: {
  heading?: string;
  headingLevel?: HeadingLevel;
  link: LinkObjectProps;
}) => {
  return (
    <section className="footer-cta">
      <div className="container">
        {heading && (
          <Heading className="heading-tag" level={headingLevel}>
            {heading}
          </Heading>
        )}
        {link && link.url && (
          <a className="usa-button usa-button--secondary" href={link.url}>
            {link.copy}
          </a>
        )}
      </div>
    </section>
  );
};
