import { PathwayGroupProps, SelectProps, SinglePathwayProps } from "../types/contentful";
import { useContentful } from "../utils/useContentful";
import { useEffect, useRef } from "react";
import { groupObjectsByLevel } from "../utils/groupObjectsByLevel";
import { IndustryFieldDrawer } from "./IndustryFieldDrawer";
import { Circle } from "@phosphor-icons/react";
import { Heading } from "./modules/Heading";

export const PathwayGroup = (props: {
  sys: { id: string };
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
  fieldId: string; // from URL
}) => {
  const data: { careerMap: PathwayGroupProps } = useContentful({
    path: `/pathway-group/${props.sys.id}`,
  });

  const fullMap = () => {
    if (data?.careerMap?.pathways) {
      const pathways = data.careerMap.pathways.items.map((path) => ({
        title: path.title,
        collection: path.occupationsCollection,
        groups: groupObjectsByLevel(path.occupationsCollection.items),
      }));
      localStorage.setItem("fullMap", JSON.stringify(pathways));
    }
  };

  useEffect(() => {
    if (data && props.activeGroup) fullMap();
  }, [data, props.activeGroup]);

  // ---- unified selection logic (used by click and auto-select) ----
  const selectField = (cm: PathwayGroupProps) => {
    props.setPaths({
      mapId: cm.sys.id,
      listTitle: cm.title,
      items: cm.pathways ? cm.pathways.items ?? [] : [],
    });

    localStorage.setItem(
      "pathItems",
      JSON.stringify({
        mapId: cm.sys.id,
        listTitle: cm.title,
        items: cm.pathways ? cm.pathways.items ?? [] : [],
      }),
    );

    // smooth scroll to groups section if present
    const groups = document.getElementById("groups");
    if (groups) groups.scrollIntoView({ behavior: "smooth", block: "center" });

    // close drawers
    props.setOpen(false);

    // update button active state (next frame so DOM exists)
    requestAnimationFrame(() => {
      const buttons = document.querySelectorAll(".button-radio button");
      buttons.forEach((b) => b.classList.remove("active"));
      const btn = document.getElementById(`${cm.title}-${cm.sys.id}`);
      if (btn) btn.classList.add("active");
    });
  };

  // ---- auto-select when fieldId matches this card ----
  const autoSelected = useRef(false);
  useEffect(() => {
    if (autoSelected.current) return;
    if (!props.fieldId) return;
    const cm = data?.careerMap;
    if (!cm) return;

    // only trigger on the instance that corresponds to the URL id
    if (cm.sys.id === props.fieldId) {
      selectField(cm);
      autoSelected.current = true;
    }
  }, [props.fieldId, data?.careerMap?.sys?.id]); // deps ensure it runs when data loads or URL changes

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
              <button
                id={`${data.careerMap.title}-${data.careerMap.sys.id}`}
                className="pathway-group-button usa-button usa-button--outline bg-white margin-right-0 primary"
                onClick={() => selectField(data.careerMap)}
              >
                <div className="radio-dot">
                  <Circle size={24} weight="regular" />
                  <Circle size={16} weight="fill" />
                </div>
                <span>
                  <span>Select </span>
                  {data.careerMap.title}
                </span>
              </button>
            </div>

            {data.careerMap.learnMoreBoxes && (
              <IndustryFieldDrawer title={data.careerMap.title} boxes={data.careerMap.learnMoreBoxes} />
            )}
          </div>
        </>
      )}
    </div>
  );
};
