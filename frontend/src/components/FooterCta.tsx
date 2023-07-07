import { LinkObjectProps } from "../types/contentful";
import { Heading } from "./modules/Heading";

export const FooterCta = ({
  heading,
  headingLevel = 3,
  link,
}: {
  heading: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  link: LinkObjectProps;
}) => {
  return (
    <section className="footer-cta">
      <div className="container">
        <Heading className="heading-tag" level={headingLevel}>
          {heading}
        </Heading>
        <a className="usa-button usa-button--secondary" href={link.url}>
          {link.copy}
        </a>
      </div>
    </section>
  );
};
