import { useEffect, useRef, useState } from "react";
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
  const [fieldId, setFieldId] = useState<string>("");
  const [mapOpen, setMapOpen] = useState(false);
  const [paths, setPaths] = useState<{
    mapId: string;
    listTitle: string;
    items: SinglePathwayProps[];
  }>();
  const [open, setOpen] = useState(false);

  // Refs to control reset behavior
  const prevMapId = useRef<string | null>(null);
  const skipFirstResetDueToURL = useRef<boolean>(false);

 const updateQueryParam = (params: Record<string, string | undefined>) => {
  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      // normalize spaces → "+"
      const formatted = value.trim().toLowerCase().replace(/\s+/g, "+");
      url.searchParams.set(key, formatted);
    } else {
      url.searchParams.delete(key);
    }
  });

  // URLSearchParams will encode + as %2B if left alone.
  // Replace both "%20" and "%2B" back into "+" for pretty output.
  const pretty = url.toString().replace(/%20/g, "+").replace(/%2B/g, "+");

  window.history.replaceState({}, "", pretty);
};


  // Parse URL and hydrate field/occupation on load and whenever careerMaps/paths change
  useEffect(() => {
    const normalizeParam = (s?: string) => (s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
    const params = new URLSearchParams(window.location.search);

    const fieldParams = params.get("field");
    const fieldOccupation = params.get("occupation");

    // If URL has occupation on first load, allow hydration before resets
    if (fieldOccupation) {
      skipFirstResetDueToURL.current = true;
    }

    if (fieldParams && careerMaps.length > 0) {
      const normalizedField = normalizeParam(fieldParams);
      
      const matchedField = careerMaps.find(
        (m) =>
          m.title.toLowerCase() === normalizedField ||
          m.sys.id === fieldParams
      );
      setFieldId(matchedField?.sys.id as string);

      if (matchedField) {
        setSelected((prev) => ({
          ...prev,
          groupId: matchedField.sys.id,
        }));
      }
    }

    // Once paths exist (after a field is selected), restore occupation if present
    if (fieldOccupation && paths) {
      const normalizedOcc = normalizeParam(fieldOccupation);
      const matchedPath = paths.items.find((p) =>
        p.occupationsCollection?.items.some((o) => o.title.toLowerCase() === normalizedOcc)
      );

      const matchedOccupation = matchedPath?.occupationsCollection?.items.find(
        (o) => o.title.toLowerCase() === normalizedOcc
      );

      if (matchedPath && matchedOccupation) {
        setSelected({
          pathway: matchedPath.occupationsCollection?.items,
          id: matchedOccupation.sys.id,
          title: matchedOccupation.title,
          pathTitle: matchedPath.title,
          shortTitle: matchedOccupation.shortTitle,
          groupId: paths.mapId,
        });
        setFieldChanged(false);
      }
    }
  }, [careerMaps, paths]);

  // Reset occupation & URL when the field (paths.mapId) changes
  useEffect(() => {
    if (!paths?.mapId) return;

    // Skip the very first reset if we came in with a deep link that includes ?occupation=
    if (!prevMapId.current && skipFirstResetDueToURL.current) {
      prevMapId.current = paths.mapId;
      return;
    }

    if (prevMapId.current !== paths.mapId) {
      // Reset occupation UI/state
      setSelected({});
      setFieldChanged(true);
      setOpen(false);

      // Clear any saved occupation
      try {
        localStorage.removeItem("occupation");
      } catch {
        // ignore
      }

      // Update URL: set new field name (or use paths.mapId) and remove occupation
      updateQueryParam({
        field: paths.listTitle, // or use paths.mapId if you prefer IDs
        occupation: undefined,
      });

      prevMapId.current = paths.mapId;
    }
  }, [paths?.mapId, paths?.listTitle]);

  // Close dropdown handlers
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
    return () => {
      document.removeEventListener("keydown", closeOnEsc);
      document.removeEventListener("click", closeDropdown);
    };
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
                fieldId={fieldId}
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
              className={`select-button${selected.id ? "" : " inactive"}`}
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
                  `-Select a ${paths.listTitle} occupation-`
                : `-Select a ${paths.listTitle} occupation-`}
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
                          updateQueryParam({
                            field: paths.listTitle,       
                            occupation: occupation.title, 
                          });
                          setTimeout(() => {
                            const el = document.getElementById("map-block");
                            if (el) {
                              const rect = el.getBoundingClientRect();
                              const scrollTop =
                                window.pageYOffset || document.documentElement.scrollTop;
                              const top = rect.top + scrollTop;
                              window.scrollTo({
                                top: top - window.innerHeight / 2,
                                behavior: "smooth",
                              });
                            }
                          }, 300);
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
