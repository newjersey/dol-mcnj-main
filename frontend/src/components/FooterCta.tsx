import { LinkObjectProps } from "../types/contentful";

export const FooterCta = ({ heading, link }: { heading: string; link: LinkObjectProps }) => {
  return (
    <section className="footer-cta">
      <div className="container">
        <h3>{heading}</h3>
        <a className="usa-button usa-button--secondary" href={link.url}>
          {link.copy}
        </a>
      </div>
    </section>
  );
};
