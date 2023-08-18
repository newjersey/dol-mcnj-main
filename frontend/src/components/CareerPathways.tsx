import { useEffect, useState } from "react";
import { OccupationNodeProps, CareerMapProps, SinglePathwayProps } from "../types/contentful";
import { PathwayGroup } from "./PathwayGroup";
import { Client } from "../domain/Client";
import { CareerDetail } from "./CareerDetail";
import { SectionHeading } from "./modules/SectionHeading";
import { Path } from "@phosphor-icons/react";

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
  const [fieldChanged, setFieldChanged] = useState(false);
  const [paths, setPaths] = useState<{
    mapId: string;
    listTitle: string;
    items: SinglePathwayProps[];
  }>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("occupation");
    const pathItems = localStorage.getItem("pathItems");
    if (stored) {
      setLocalData(JSON.parse(stored));
    }

    if (pathItems) {
      setPaths(JSON.parse(pathItems));
    }
  }, []);

  const details = selected.id ? selected : localData || {};

  const breadcrumbs = {
    industry,
    group: careerMaps.filter((m) => m.sys.id === details.groupId)[0]?.title || "",
    pathway: details.title || "",
  };

  useEffect(() => {
    setFieldChanged(true);
  }, [paths]);

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
                  setPaths={setPaths}
                  setOpen={setOpen}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="select">
          <p>
            <strong>Select an Occupation in {paths?.listTitle}</strong>
          </p>

          <button
            type="button"
            aria-label="occupation-selector"
            className="select-button"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {!fieldChanged ? details?.shortTitle || details?.title || "---" : "---"}
          </button>

          {open && (
            <div className="dropdown-select">
              {paths?.items.map((path) => (
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
                        setFieldChanged(false);
                        setSelected({
                          pathway: path.occupationsCollection?.items,
                          id: occupation.sys.id,
                          title: occupation.title,
                          shortTitle: occupation.shortTitle,
                          groupId: paths.mapId,
                        });
                        localStorage.setItem(
                          "occupation",
                          JSON.stringify({
                            pathway: path.occupationsCollection?.items,
                            id: occupation.sys.id,
                            shortTitle: occupation.shortTitle,
                            title: occupation.title,
                            groupId: paths.mapId,
                          }),
                        );
                        setOpen(false);
                      }}
                    >
                      {occupation.shortTitle || occupation.title}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
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
