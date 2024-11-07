import { SectionHeading } from "@components/modules/SectionHeading";
import { Path } from "@phosphor-icons/react";
import {
  CareerMapProps,
  IndustryProps,
  OccupationNodeProps,
} from "@utils/types";

interface OccupationGroupsProps {
  activeMap?: CareerMapProps;
  industry: IndustryProps;
  setMapOpen: (open: boolean) => void;
  setOpen: (open: boolean) => void;
  activeOccupation?: {
    careerMapObject: OccupationNodeProps;
  };
  setActivePathway: (pathway: any) => void;
  getOccupation: (id: string) => void;
  open?: boolean;
}

export const OccupationGroups = ({
  activeMap,
  industry,
  setMapOpen,
  activeOccupation,
  setOpen,
  setActivePathway,
  getOccupation,
  open,
}: OccupationGroupsProps) => {
  return (
    <div className={`occupationGroups${activeMap ? "" : " disabled"}`}>
      <div className="container">
        <div className="groups">
          <SectionHeading
            headingLevel={4}
            noDivider
            heading={
              activeMap
                ? `Select a ${activeMap.careerMap.title} occupation`
                : "Select an occupation"
            }
          />

          <div className="select">
            {activeMap ? "" : `Select a ${industry.title} field above first`}
            <button
              type="button"
              disabled={!activeMap}
              className="select-button"
              aria-label="occupationSelector"
              onClick={() => {
                setMapOpen(false);
                setOpen(!open);
              }}
            >
              {activeOccupation
                ? activeOccupation.careerMapObject.title
                : `-Select an occupation-`}
            </button>
            {open && (
              <div className="dropdown-select">
                {activeMap?.careerMap.pathways?.items.map((path) => (
                  <div key={path.sys.id}>
                    <p className="path-title">
                      <Path size={32} />
                      {path.title}
                    </p>
                    {path.occupationsCollection.items.map((occupation) => (
                      <button
                        key={occupation.sys.id}
                        aria-label="occupation-item"
                        type="button"
                        className="occupation"
                        onClick={() => {
                          setOpen(false);
                          setMapOpen(false);
                          setActivePathway(path);
                          getOccupation(occupation.sys.id);
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
      </div>
    </div>
  );
};
