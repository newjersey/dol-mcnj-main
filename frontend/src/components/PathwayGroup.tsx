import { CAREER_PATHWAY_QUERY } from "../queries/careerPathway";
import { PathwayGroupProps } from "../types/contentful";
import { useContentfulClient } from "../utils/useContentfulClient";

export const PathwayGroup = (props: {
  sys: {
    id: string;
  };
  active?: boolean;
  setSelected: (id: string) => void;
  title: string;
  icon: "explore" | "jobs" | "support" | "training" | "healthcare" | "manufacturing" | "tdl";
}) => {
  const data: {
    careerMap: PathwayGroupProps;
  } = useContentfulClient({
    query: CAREER_PATHWAY_QUERY,
    variables: { id: props.sys.id },
  });

  return (
    <>
      {data && (
        <div className="usa-radio">
          <input
            className="usa-radio__input"
            id={`${data.careerMap.title}-${data.careerMap.sys.id}`}
            type="radio"
            name={`${props.icon}-pathways`}
            defaultChecked={props.active}
            onChange={(e) => {
              const selects = document.querySelectorAll("select");
              selects.forEach((select: HTMLSelectElement) => {
                if (select.value !== e.target.value) {
                  select.value = "";
                }
              });
            }}
          />
          <label
            className="usa-radio__label"
            htmlFor={`${data.careerMap.title}-${data.careerMap.sys.id}`}
          >
            {data.careerMap.title}
          </label>
          <div className="select">
            <p>
              <strong>Select an Occupation in {data.careerMap.title}</strong>
            </p>
            <select
              name={`${data.careerMap.title}`}
              onChange={(e) => {
                props.setSelected(e.target.value);

                const selects = document.querySelectorAll("select");
                selects.forEach((select) => {
                  if (select.value !== e.target.value) {
                    select.value = "";
                  }
                });
              }}
            >
              <option value="">---</option>
              {data.careerMap.pathways?.items.map((pathItem) => (
                <option key={pathItem.sys.id} value={pathItem.sys.id}>
                  {pathItem.title || pathItem.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
};
