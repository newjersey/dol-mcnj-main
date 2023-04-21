import { Selector } from "../svg/Selector";
import { IndustryProps } from "../types/contentful";

export const IndustrySelector = ({
  industries,
  current,
}: {
  industries: IndustryProps[];
  current?: string;
}) => {
  return (
    <section className="industry-selector">
      <div className="container">
        <div className="heading">
          <h2>Select an Industry</h2>
        </div>
        <nav aria-label="industry-nav" id="industry-nav">
          <ul className="unstyled">
            {industries.map(({ sys, title, slug }) => (
              <li key={sys.id} className={current === slug ? "active" : undefined}>
                <a href={`/career-pathways/${slug}`}>
                  <div className="icon">
                    <Selector name={slug} color="#000" />
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
