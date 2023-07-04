import { Selector } from "../svg/Selector";
import { LinkObjectProps } from "../types/contentful";

export const Interrupter = ({ header, links }: { header: string; links: LinkObjectProps[] }) => {
  return (
    <section className="interrupter">
      <div className="container">
        <h4>{header}</h4>
        <ul className="unstyled">
          {links.map((link) => (
            <li key={link.sys?.id}>
              <a className="usa-button" href={link.url}>
                <Selector name="supportBold" />
                {link.copy}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
