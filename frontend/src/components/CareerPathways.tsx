import { useState } from "react";
import { CareerMapProps } from "../types/contentful";
import { PathwayGroup } from "./PathwayGroup";
import { Client } from "../domain/Client";
import { CareerDetail } from "./CareerDetail";

export const CareerPathways = ({
  icon,
  industry,
  careerMaps,
  client,
}: {
  industry: string;
  icon: "explore" | "jobs" | "support" | "training" | "healthcare" | "manufacturing" | "tdl";
  careerMaps: CareerMapProps[];
  client: Client;
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

        {selected && <CareerDetail mapId={selected} client={client} />}
      </div>
    </div>
  );
};
