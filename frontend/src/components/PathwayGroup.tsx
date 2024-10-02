import { PathwayGroupProps, SelectProps, SinglePathwayProps } from "../types/contentful";
import { useContentful } from "../utils/useContentful";
import { useEffect } from "react";
import { groupObjectsByLevel } from "../utils/groupObjectsByLevel";
import { IndustryFieldDrawer } from "./IndustryFieldDrawer";
import { Circle } from "@phosphor-icons/react";
import { Heading } from "./modules/Heading";

export const PathwayGroup = (props: {
  sys: {
    id: string;
  };
  activeGroup?: boolean;
  industry: string;
  active?: boolean;
  setSelected: (id: SelectProps) => void;
  selected?: SelectProps;
  setMapOpen: (open: boolean) => void;
  setOpen: (open: boolean) => void;
  setPaths: (paths: { mapId: string; listTitle: string; items: SinglePathwayProps[] }) => void;
  title: string;
  icon: string;
}) => {
  const data: {
    careerMap: PathwayGroupProps;
  } = useContentful({
    path: `/pathway-group/${props.sys.id}`,
  });

  const fullMap = () => {
    if (data?.careerMap.pathways) {
      const pathways = data.careerMap.pathways.items.map((path) => ({
        title: path.title,
        collection: path.occupationsCollection,
        groups: groupObjectsByLevel(path.occupationsCollection.items),
      }));

      localStorage.setItem("fullMap", JSON.stringify(pathways));
    }
  };
  useEffect(() => {
    if (data && props.activeGroup) {
      fullMap();
    }
  }, [data, props.activeGroup]);

  return (
    <div className="selection-container">
      {data && (
        <>
          <div className="selection-content">
            <Heading level={2}>{data.careerMap.title}</Heading>
            <p>{`Explore ${data.careerMap.title} pathways in the field of ${props.industry} in the state of New Jersey.`}</p>
          </div>
          <div className="buttons">
            <div className="button-radio">
              <input
                id={`${data.careerMap.title}-${data.careerMap.sys.id}`}
                type="checkbox"
                name={`${props.icon}-pathways`}
                defaultChecked={props.active}
                onChange={(e) => {
                  props.setPaths({
                    mapId: data.careerMap.sys.id,
                    listTitle: data.careerMap.title,
                    items: data.careerMap.pathways ? data.careerMap.pathways?.items || [] : [],
                  });
                  localStorage.setItem(
                    "pathItems",
                    JSON.stringify({
                      mapId: data.careerMap.sys.id,
                      listTitle: data.careerMap.title,
                      items: data.careerMap.pathways ? data.careerMap.pathways?.items || [] : [],
                    }),
                  );

                  // uncheck all other checkboxes
                  // Uncheck all other checkboxes
                  const checkboxes: NodeListOf<HTMLInputElement> =
                    document.querySelectorAll("input[type=checkbox]");
                  checkboxes.forEach((checkbox: HTMLInputElement) => {
                    if (checkbox.id !== `${data.careerMap.title}-${data.careerMap.sys.id}`) {
                      checkbox.checked = false;
                    }
                  });

                  const groups = document.getElementById("groups");
                  if (groups) {
                    groups.scrollIntoView({ behavior: "smooth", block: "center" });
                  }

                  props.setOpen(false);
                }}
              />

              <label
                htmlFor={`${data.careerMap.title}-${data.careerMap.sys.id}`}
                className="usa-button usa-button--outline bg-white margin-right-0 primary"
              >
                <div className="radio-dot">
                  <Circle size={24} weight="regular" />
                  <Circle size={16} weight="fill" />
                </div>
                <span>
                  <span>Select </span>
                  {data.careerMap.title}
                </span>
              </label>
            </div>
            {data.careerMap.learnMoreBoxes && (
              <IndustryFieldDrawer
                title={data.careerMap.title}
                boxes={data.careerMap.learnMoreBoxes}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
