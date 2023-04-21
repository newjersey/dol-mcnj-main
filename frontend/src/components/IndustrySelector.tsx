import { Selector } from "../svg/Selector";
import { IndustryProps } from "../types/contentful";

export const IndustrySelector = ({
  industries,
  current,
}: {
  industries: IndustryProps[];
  current?: string;
}) => {
  // sort industries by title with
  const byTitle = industries.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });
  return (
    <section className="industry-selector">
      <div className="container">
        <div className="heading">
          <h2>Select an Industry</h2>
        </div>
        <nav aria-label="industry-nav" id="industry-nav">
          <ul className="unstyled">
            {byTitle.map(({ sys, title, slug }) => (
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
