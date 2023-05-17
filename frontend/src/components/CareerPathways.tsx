import { useState } from "react";
import { CareerMapProps } from "../types/contentful";
import { PathwayGroup } from "./PathwayGroup";
import { SinglePath } from "./SinglePath";

export const CareerPathways = ({
  icon,
  industry,
  careerMaps,
}: {
  industry: string;
  icon: "explore" | "jobs" | "support" | "training" | "healthcare" | "manufacturing" | "tdl";
  careerMaps: CareerMapProps[];
}) => {
  const [selected, setSelected] = useState<string>();

  return (
    <div className="career-pathways">
      <div className="container plus">
        <div className="path-selector">
          <div className="heading">
            <h3>{industry} Career Pathways</h3>
          </div>
          <div className="groups">
            <p>
              <strong>Select a {industry} Field</strong>
            </p>
            {careerMaps.map((map, index) => (
              <PathwayGroup
                key={map.sys.id}
                {...map}
                icon={icon}
                setSelected={setSelected}
                active={index === 0}
              />
            ))}
          </div>
        </div>

        {selected && <SinglePath mapId={selected} />}
      </div>
    </div>
  );
};
