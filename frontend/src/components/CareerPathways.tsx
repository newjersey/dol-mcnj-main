import { useEffect, useState } from "react";
import { OccupationNodeProps, CareerMapProps, SinglePathwayProps } from "../types/contentful";
import { PathwayGroup } from "./PathwayGroup";
import { Client } from "../domain/Client";
import { CareerDetail } from "./CareerDetail";
import { Path } from "@phosphor-icons/react";
import { Heading } from "./modules/Heading";

interface SelectedProps {
  pathway?: OccupationNodeProps[];
  id?: string;
  title?: string;
  pathTitle?: string;
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
  const [fieldChanged, setFieldChanged] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [paths, setPaths] = useState<{
    mapId: string;
    listTitle: string;
    items: SinglePathwayProps[];
  }>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFieldChanged(true);
  }, [paths]);

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".dropdown-select") || target.closest(".select-button")) return;
      setOpen(false);
    };

    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEsc);
    document.addEventListener("click", closeDropdown);
  }, []);

  const details = selected.id ? selected : {};

  const breadcrumbs = {
    industry,
    group: careerMaps.filter((m) => m.sys.id === details.groupId)[0]?.title || "",
    pathway: details.title || "",
  };

  const dropValue = !fieldChanged ? details?.shortTitle || details?.title || "---" : "---";
  const notEmpty = dropValue !== "---";

  return (
    <div className="career-pathways">
      <div className="container">
        <div className="path-selector">
          <div className="selections">
            {careerMaps.map((map) => (
              <PathwayGroup
                key={map.sys.id}
                {...map}
                icon={icon}
                selected={selected.id ? selected : {}}
                setSelected={setSelected}
                active={details?.groupId === map.sys.id}
                activeGroup={details?.groupId === map.sys.id}
                setPaths={setPaths}
                setMapOpen={setMapOpen}
                industry={industry}
                setOpen={setOpen}
              />
            ))}
          </div>
        </div>

        <div id="groups" className={`groups${!paths ? " disabled" : ""}`}>
          <Heading level={3}>
            {`Select ${paths ? `a ${paths.listTitle}` : "an"} occupation`}
          </Heading>
          <div className="select">
            {!paths && <p>Select a {industry} field above first.</p>}
            <button
              type="button"
              aria-label="occupation-selector"
              className="select-button"
              disabled={!paths}
              onClick={() => {
                setOpen(!open);
              }}
            >
              {!paths
                ? "-Select an occupation-"
                : !fieldChanged
                  ? details?.shortTitle ||
                    details?.title ||
                    `Select a ${paths.listTitle} occupation`
                  : `Select a ${paths.listTitle} occupation`}
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
                            pathTitle: path.title,
                            shortTitle: occupation.shortTitle,
                            groupId: paths.mapId,
                          });
                          localStorage.setItem(
                            "occupation",
                            JSON.stringify({
                              pathway: path.occupationsCollection?.items,
                              id: occupation.sys.id,
                              pathTitle: path.title,
                              shortTitle: occupation.shortTitle,
                              title: occupation.title,
                              groupId: paths.mapId,
                            }),
                          );
                          setMapOpen(false);
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
        </div>
      </div>

      {details.id && notEmpty && (
        <CareerDetail
          detailsId={details.id}
          breadcrumbs={breadcrumbs}
          setMapOpen={setMapOpen}
          mapOpen={mapOpen}
          client={client}
          pathway={selected.id ? selected.pathway : []}
          selected={selected.id ? selected : {}}
          setSelected={setSelected}
          groupTitle={paths?.listTitle}
        />
      )}
    </div>
  );
};
