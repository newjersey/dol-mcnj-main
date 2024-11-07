"use client";
import { Button } from "@components/modules/Button";
import { SectionHeading } from "@components/modules/SectionHeading";
import { Path } from "@phosphor-icons/react";
import { client } from "@utils/client";
import {
  CareerMapProps,
  InDemandItemProps,
  IndustryProps,
  OccupationDetail,
  OccupationNodeProps,
  SinglePathwayProps,
} from "@utils/types";
import { OCCUPATION_QUERY } from "queries/occupationQuery";
import { CAREER_PATHWAY_QUERY } from "queries/pathway";
import { Fragment, useEffect, useState } from "react";
import { LearnMoreDrawer } from "./LearnMoreDrawer";
import { Details } from "./Details";
import { groupObjectsByLevel } from "@utils/groupObjectsByLevel";
import { toUsCurrency } from "@utils/toUsCurrency";
import { InDemandDetails } from "./InDemandDetails";
import { Spinner } from "@components/modules/Spinner";
import { ErrorBox } from "@components/modules/ErrorBox";
import { colors } from "@utils/settings";
import { CareerMapItemProps } from "@utils/types/components";

export const Content = ({ thisIndustry }: { thisIndustry: IndustryProps }) => {
  const [activeMap, setActiveMap] = useState<CareerMapProps>();
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [inDemandOpen, setInDemandOpen] = useState(false);
  const [activeInDemand, setActiveInDemand] = useState<InDemandItemProps>();
  const [inDemandOccupationData, setInDemandOccupationData] =
    useState<OccupationDetail>();
  const [activePathway, setActivePathway] = useState<SinglePathwayProps>();
  const [inDemandError, setInDemandError] = useState<string>();
  const [activeOccupation, setActiveOccupation] = useState<{
    careerMapObject: OccupationNodeProps;
  }>();
  const [fullMap, setFullMap] = useState<SinglePathwayProps[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const getCareerMap = async (id: string) => {
    const mapData = await client({
      query: CAREER_PATHWAY_QUERY,
      variables: {
        id,
      },
    });
    setActiveMap(mapData);
    sessionStorage.setItem("careerMap", JSON.stringify(mapData));
  };

  const getOccupation = async (id: string) => {
    const occupationData = await client({
      query: OCCUPATION_QUERY,
      variables: {
        id,
      },
    });
    setActiveOccupation(occupationData);
    sessionStorage.setItem("occupation", JSON.stringify(occupationData));
  };

  useEffect(() => {
    const careerMap = sessionStorage.getItem("careerMap");
    const occupation = sessionStorage.getItem("occupation");
    const pathway = sessionStorage.getItem("pathway");

    if (careerMap) {
      setActiveMap(JSON.parse(careerMap));

      const pathways: SinglePathwayProps[] =
        JSON.parse(careerMap)?.careerMap.pathways?.items;

      if (pathway) {
        const filteredPathways = pathways?.filter(
          (path) => path.title !== JSON.parse(pathway)?.title,
        );
        setFullMap([JSON.parse(pathway), ...filteredPathways]);
      }
    }

    if (occupation) {
      setActiveOccupation(JSON.parse(occupation));
    }

    if (pathway) {
      setActivePathway(JSON.parse(pathway));
    }
  }, []);

  useEffect(() => {
    const filteredPathways = activeMap?.careerMap.pathways?.items?.filter(
      (path) => path.title !== activePathway?.title,
    );
    if (filteredPathways && activePathway) {
      setFullMap([activePathway, ...filteredPathways]);
    }
  }, [activePathway]);

  useEffect(() => {
    if (activeInDemand) {
      const getInDemandOccupation = async () => {
        setLoading(true);
        const occupation = await fetch(
          `${process.env.REACT_APP_SITE_URL}/api/getOccupation/${activeInDemand.idNumber}`,
        );

        if (!occupation.ok) {
          setInDemandError("There was an error fetching the occupation data.");
          setLoading(false);
          return;
        }

        const occupationData = await occupation.json();

        setInDemandOccupationData(occupationData);
        setLoading(false);
      };

      getInDemandOccupation();
    }
  }, [activeInDemand]);

  const hasPathways: boolean = thisIndustry.careerMaps?.items.length !== 0;

  return (
    <div className="container">
      <SectionHeading
        headingLevel={3}
        heading={`Select a ${thisIndustry.title} Field`}
        description="Select a field and explore different career pathways or click the tool tip to learn more about it."
      />

      {thisIndustry.careerMaps && thisIndustry.careerMaps.items.length > 0 && (
        <div className="buttons">
          {thisIndustry.careerMaps.items.map((map, index) => (
            <div key={map.sys.id} className="stack">
              <Button
                info={
                  activeMap?.careerMap.title === map.title ? undefined : true
                }
                type="button"
                highlight={
                  activeMap?.careerMap.title === map.title
                    ? "purple"
                    : undefined
                }
                onClick={() => {
                  setOpen(false);
                  setMapOpen(false);
                  setActiveOccupation(undefined);
                  sessionStorage.removeItem("occupation");
                  setActivePathway(undefined);
                  sessionStorage.removeItem("pathway");
                  getCareerMap(map.sys.id);
                  setFullMap(undefined);
                }}
              >
                {map.title}
              </Button>
              {map.learnMoreBoxes?.length > 0 && <LearnMoreDrawer map={map} />}
            </div>
          ))}
        </div>
      )}

      {hasPathways && activeMap ? (
        <>
          <div className="groups">
            <SectionHeading
              headingLevel={4}
              heading={`Explore ${activeMap.careerMap.title} Occupations and Pathways`}
              description="Explore related occupations and learn important details."
            />
            <div className="select">
              Select a {activeMap.careerMap.title.toLowerCase()} occupation
              <button
                type="button"
                className="select-button"
                aria-label="occupationSelector"
                onClick={() => {
                  setMapOpen(false);
                  setOpen(!open);
                }}
              >
                {activeOccupation
                  ? activeOccupation.careerMapObject.title
                  : `---`}
              </button>
              {open && (
                <div className="dropdown-select">
                  {activeMap.careerMap.pathways?.items.map((path) => (
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
                            sessionStorage.setItem(
                              "pathway",
                              JSON.stringify(path),
                            );

                            sessionStorage.setItem(
                              "occupation",
                              JSON.stringify(occupation),
                            );
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
          {activeOccupation && (
            <>
              <Button
                tag
                type="button"
                iconWeight="bold"
                iconPrefix={mapOpen ? "ArrowsInSimple" : "ArrowsOutSimple"}
                onClick={() => {
                  setMapOpen(!mapOpen);
                }}
              >
                See the {mapOpen ? "full" : "less"}
                <strong>{activeMap?.careerMap.title} Pathways</strong>
                map
              </Button>

              {fullMap && (
                <>
                  <div className="full-map" id="full-career-map">
                    <div className="inner">
                      {(mapOpen ? fullMap : fullMap?.slice(0, 1)).map(
                        (pathItem) => {
                          const pathways = groupObjectsByLevel(
                            pathItem.occupationsCollection.items,
                          );
                          return (
                            <Fragment key={pathItem.sys.id}>
                              <p className="path-title">{pathItem.title}</p>
                              <ul className="single-path">
                                {pathways.map((path) => {
                                  const isTall = path.length > 1;
                                  return (
                                    <li
                                      key={path[0].sys.id}
                                      className={isTall ? "tall" : undefined}
                                    >
                                      {path.map((occupation) => {
                                        const isActive =
                                          activeOccupation.careerMapObject.sys
                                            .id === occupation.sys.id;
                                        return (
                                          <button
                                            key={`occ${occupation.sys.id}`}
                                            type="button"
                                            onClick={() => {
                                              setMapOpen(false);

                                              setActivePathway(pathItem);
                                              sessionStorage.setItem(
                                                "pathway",
                                                JSON.stringify(pathItem),
                                              );

                                              getOccupation(occupation.sys.id);
                                              sessionStorage.setItem(
                                                "occupation",
                                                JSON.stringify(occupation),
                                              );
                                            }}
                                            className={`path-stop${
                                              isActive ? " active" : ""
                                            }`}
                                          >
                                            <span className="prev-path-connector"></span>
                                            <span className="path-connector"></span>
                                            <span className="arrow"></span>
                                            <p className="title">
                                              <strong>
                                                {occupation.title}
                                              </strong>
                                            </p>
                                            <div className="salary">
                                              <p>Salary Range</p>
                                              <p>
                                                <strong>
                                                  {toUsCurrency(
                                                    occupation.salaryRangeStart,
                                                  )}
                                                  k -
                                                  {toUsCurrency(
                                                    occupation.salaryRangeEnd,
                                                  )}
                                                  k
                                                </strong>
                                              </p>
                                            </div>
                                            <div className="education">
                                              <p>Min. Education</p>
                                              <p>
                                                <strong>
                                                  High School Diploma
                                                </strong>
                                              </p>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </li>
                                  );
                                })}
                              </ul>
                            </Fragment>
                          );
                        },
                      )}
                    </div>
                  </div>
                </>
              )}
              <Details
                content={activeOccupation.careerMapObject}
                parents={{
                  industry: thisIndustry.title,
                  field: activeMap?.careerMap.title,
                }}
              />
            </>
          )}
        </>
      ) : (
        thisIndustry.inDemandCollection &&
        thisIndustry.inDemandCollection.items.length > 0 && (
          <>
            <div className="occupationSelector">
              <label htmlFor="occupationSelector">
                Select an in-demand{" "}
                {(
                  thisIndustry.shorthandTitle || thisIndustry.title
                ).toLocaleLowerCase()}{" "}
                occupation
                <button
                  type="button"
                  aria-label="occupation selector"
                  className="select-button"
                  onClick={() => {
                    setInDemandOpen(!inDemandOpen);
                  }}
                >
                  {activeInDemand
                    ? activeInDemand.title
                    : "Please choose an occupation"}
                </button>
              </label>
              {inDemandOpen && (
                <div className="dropdown-select">
                  {thisIndustry.inDemandCollection.items.map((item) => (
                    <button
                      key={item.sys.id}
                      aria-label="occupation-item"
                      type="button"
                      className="occupation"
                      onClick={() => {
                        setActiveInDemand(item);
                        setInDemandOpen(false);
                      }}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {(loading || inDemandError || inDemandOccupationData) && (
              <>
                {loading ? (
                  <Spinner color={colors.primary} size={75} />
                ) : inDemandError ? (
                  <ErrorBox
                    heading={inDemandError}
                    copy="We couldn't find any entries with that name. Please try again."
                  />
                ) : (
                  <>
                    {inDemandOccupationData && (
                      <InDemandDetails content={inDemandOccupationData} />
                    )}
                  </>
                )}
              </>
            )}
          </>
        )
      )}
    </div>
  );
};
