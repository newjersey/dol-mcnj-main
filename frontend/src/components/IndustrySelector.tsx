import { Selector } from "../svg/Selector";
import { IndustryProps } from "../types/contentful";

export const IndustrySelector = ({ industries }: { industries: IndustryProps[] }) => {
  return (
    <section className="industry-selector">
      <div className="container">
        <div className="heading">
          <h2>Select an Industry</h2>
        </div>
        <nav id="industry-nav">
          <ul className="unstyled">
            {industries.map(({ sys, title, slug }) => (
              <li key={sys.id}>
                <a href={`/${slug}`}>
                  <div className="icon">
                    <Selector name={slug} />
                  </div>
                  <span>{title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};
