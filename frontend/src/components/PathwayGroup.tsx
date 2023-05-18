import { Path } from "@phosphor-icons/react";
import { CAREER_PATHWAY_QUERY } from "../queries/careerPathway";
import { OccupationNodeProps, PathwayGroupProps } from "../types/contentful";
import { useContentfulClient } from "../utils/useContentfulClient";
import { useState } from "react";

interface SelectProps {
  pathway?: OccupationNodeProps[];
  title?: string;
  id?: string;
  groupId?: string;
}

export const PathwayGroup = (props: {
  sys: {
    id: string;
  };
  activeGroup?: boolean;
  active?: boolean;
  setSelected: (id: SelectProps) => void;
  selected?: SelectProps;
  title: string;
  icon: "explore" | "jobs" | "support" | "training" | "healthcare" | "manufacturing" | "tdl";
}) => {
  const data: {
    careerMap: PathwayGroupProps;
  } = useContentfulClient({
    query: CAREER_PATHWAY_QUERY,
    variables: { id: props.sys.id },
  });
  const [open, setOpen] = useState(false);

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

            <button
              type="button"
              aria-label="occupation-selector"
              className="select-button"
              onClick={() => {
                setOpen(!open);
              }}
            >
              {props.activeGroup ? props.selected?.title || "---" : "---"}
            </button>
            {open && (
              <div className="dropdown-select">
                {data.careerMap.pathways?.items.map((path) => (
                  <div key={path.sys.id}>
                    <p className="path-title">
                      <Path size={32} />
                      {path.title}
                    </p>
                    {path.occupationsCollection?.items.map((occupation) => (
                      <button
                        aria-label="occupation-item"
                        type="button"
                        key={occupation.sys.id}
                        className="occupation"
                        onClick={() => {
                          props.setSelected({
                            pathway: path.occupationsCollection?.items,
                            id: occupation.sys.id,
                            title: occupation.title,
                            groupId: data.careerMap.sys.id,
                          });
                          localStorage.setItem(
                            "occupation",
                            JSON.stringify({
                              pathway: path.occupationsCollection?.items,
                              id: occupation.sys.id,
                              title: occupation.title,
                              groupId: data.careerMap.sys.id,
                            })
                          );
                          setOpen(false);
                        }}
                      >
                        {occupation.title}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
