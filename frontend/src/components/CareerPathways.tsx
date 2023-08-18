import { useEffect, useState } from "react";
import { OccupationNodeProps, CareerMapProps } from "../types/contentful";
import { PathwayGroup } from "./PathwayGroup";
import { Client } from "../domain/Client";
import { CareerDetail } from "./CareerDetail";
import { SectionHeading } from "./modules/SectionHeading";

interface SelectedProps {
  pathway?: OccupationNodeProps[];
  id?: string;
  title?: string;
  shortTitle?: string;
  groupId?: string;
}

export const CareerPathways = ({
  icon,
  industry,
  careerMaps,
  client,
}: {
  industry: string;
  icon: string;
  careerMaps: CareerMapProps[];
  client: Client;
}) => {
  const [selected, setSelected] = useState<SelectedProps>({});
  const [localData, setLocalData] = useState<SelectedProps>();

  useEffect(() => {
    const stored = localStorage.getItem("occupation");
    if (stored) {
      setLocalData(JSON.parse(stored));
    }
  }, []);

  const details = selected.id ? selected : localData || {};

  const breadcrumbs = {
    industry,
    group: careerMaps.filter((m) => m.sys.id === details.groupId)[0]?.title || "",
    pathway: details.title || "",
  };

  return (
    <div className="career-pathways">
      <div className="container plus">
        <div className="path-selector">
          <SectionHeading
            headingLevel={3}
            heading={`Select a ${industry} Field`}
            description="Select a field and explore different career pathways or click the tool tip to learn more about it."
          />
          <div className="groups">
            <p>
              <strong>Select a {industry} Field</strong>
            </p>
            <div className="selections">
              {careerMaps.map((map, index) => (
                <PathwayGroup
                  key={map.sys.id}
                  {...map}
                  icon={icon}
                  selected={selected.id ? selected : localData || {}}
                  setSelected={setSelected}
                  active={details?.groupId === map.sys.id || index === 0}
                  activeGroup={details?.groupId === map.sys.id}
                />
              ))}
            </div>
          </div>
        </div>

        {details.id && (
          <CareerDetail
            detailsId={details.id}
            breadcrumbs={breadcrumbs}
            client={client}
            pathway={selected.id ? selected.pathway : localData?.pathway || []}
            selected={selected.id ? selected : localData || {}}
            setSelected={setSelected}
            groupTitle={careerMaps.filter((m) => m.sys.id === selected.groupId)[0]?.title || ""}
          />
        )}
      </div>
    </div>
  );
};
