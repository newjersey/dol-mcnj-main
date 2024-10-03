import { OccupationNodeProps, SelectProps } from "../types/contentful";
import { flattenArray } from "../utils/flattenArray";
import { numberShorthand } from "../utils/numberShorthand";

export const SinglePath = ({
  items,
  heading,
  setSelected,
  setOpen,
  onClick,
}: {
  heading?: string;
  setOpen?: (open: boolean) => void;
  setSelected: (id: SelectProps) => void;
  onClick?: () => void;
  items: OccupationNodeProps[][];
}) => {
  const getOccupation = localStorage.getItem("occupation");
  const occupation = getOccupation ? JSON.parse(getOccupation) : null;

  return (
    <>
      <p className="path-title">{heading}</p>
      <ul className="single-path">
        {items.map((column) => {
          const isTall = column.length > 1;
          return (
            <li key={column[0].sys.id} className={isTall ? "tall" : undefined}>
              {column.map((item) => (
                <button
                  type="button"
                  className={`path-stop${item.sys.id === occupation.id ? " active" : ""}`}
                  key={item.sys.id}
                  onClick={() => {
                    onClick && onClick();
                    if (setOpen) {
                      setOpen(false);
                    }
                    if (setSelected) {
                      setSelected({
                        id: item.sys.id,
                        title: item.title,
                        shortTitle: item.shortTitle,
                        pathTitle: heading,
                        groupId: occupation.groupId,
                        pathway: flattenArray(items),
                      });
                      localStorage.setItem(
                        "occupation",
                        JSON.stringify({
                          id: item.sys.id,
                          title: item.title,
                          shortTitle: item.shortTitle,
                          pathTitle: heading,
                          groupId: occupation.groupId,
                          pathway: flattenArray(items),
                        }),
                      );
                    }
                  }}
                >
                  <span className="prev-path-connector" />
                  <span className="path-connector" />
                  <span className="arrow" />
                  <p className="title">
                    <strong>{item.shortTitle || item.title}</strong>
                  </p>

                  {item.salaryRangeStart && item.salaryRangeEnd ? (
                    <div className="salary">
                      <p>Salary Range</p>
                      <p>
                        <strong>
                          ${numberShorthand(item.salaryRangeStart)} - $
                          {numberShorthand(item.salaryRangeEnd)}
                        </strong>
                      </p>
                    </div>
                  ) : item.medianSalary ? (
                    <div className="salary median">
                      <p>Median Range</p>
                      <p>
                        <strong>${numberShorthand(item.medianSalary)}</strong>
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {item.educationLevel && (
                    <div className="education">
                      <p>Min. Education</p>
                      <p>
                        <strong>{item.educationLevel}</strong>
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </li>
          );
        })}
      </ul>
    </>
  );
};
