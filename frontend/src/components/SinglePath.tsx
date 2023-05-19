import { OccupationNodeProps } from "../types/contentful";
import { numberShorthand } from "../utils/numberShorthand";

export const SinglePath = ({ items }: { items: OccupationNodeProps[][] }) => {
  return (
    <ul className="single-path">
      {items.map((column, index: number) => {
        const isTall = column.length > 1;
        const isNotFirst = index > 0;
        return (
          <li key={column[0].sys.id} className={isTall ? "tall" : undefined}>
            {column.map((item) => (
              <button type="button" className="path-stop" key={item.sys.id}>
                <span className="prev-path-connector" />
                <span className="path-connector" />
                <span className="arrow" />
                <p className="title">
                  <strong>{item.shortTitle || item.title}</strong>
                </p>
                <div className="salary">
                  <p>Salary Range</p>
                  <p>
                    <strong>
                      ${numberShorthand(item.salaryRangeStart)} - $
                      {numberShorthand(item.salaryRangeEnd)}
                    </strong>
                  </p>
                </div>
                <div className="education">
                  <p>Min. Education</p>
                  <p>
                    <strong>{item.educationLevel}</strong>
                  </p>
                </div>
              </button>
            ))}
          </li>
        );
      })}
    </ul>
  );
};
