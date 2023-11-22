import { Selector } from "../svg/Selector";
import { IndustryProps } from "../types/contentful";
import { SectionHeading } from "./modules/SectionHeading";

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
      <div className="container plus">
        <SectionHeading
          heading="Select an Industry"
          description="Explore popular industries in New Jersey. More Industries coming soon!"
        />
        <nav aria-label="Industry Navigation" id="industry-nav">
          <ul className="unstyled">
            {byTitle.map(({ sys, title, slug }) => (
              <li key={sys.id}>
                <a
                  href={`/career-pathways/${slug}`}
                  className={current === slug ? "active" : undefined}
                >
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
