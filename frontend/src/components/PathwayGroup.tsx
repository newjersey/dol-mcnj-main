import { CAREER_PATHWAY_QUERY } from "../queries/careerPathway";
import { useContentfulClient } from "../utils/useContentfulClient";
import { CareerMapNodeProps } from "./modules/CareerMapNode";

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
    careerMap: {
      title: string;
      sys: {
        id: string;
      };
      careerPathwayItemsCollection: {
        items: CareerMapNodeProps[];
      };
    };
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
              props.setSelected("");
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
              {data.careerMap.careerPathwayItemsCollection.items.map((mapItem) => (
                <option key={mapItem.sys.id} value={mapItem.sys.id}>
                  {mapItem.shortTitle || mapItem.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
};
