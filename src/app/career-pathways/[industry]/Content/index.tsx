"use client";
import { Button } from "@components/modules/Button";
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
import { Details } from "./Details";
import { groupObjectsByLevel } from "@utils/groupObjectsByLevel";
import { InDemandDetails } from "./InDemandDetails";
import { Spinner } from "@components/modules/Spinner";
import { ErrorBox } from "@components/modules/ErrorBox";
import { colors } from "@utils/settings";
import { ManufacturingSelect } from "@components/blocks/ManufacturingSelect";
import { OccupationGroups } from "@components/blocks/OccupationGroups";
import { numberShorthand } from "@utils/numberShorthand";

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
  };

  const getOccupation = async (id: string) => {
    const occupationData = await client({
      query: OCCUPATION_QUERY,
      variables: {
        id,
      },
    });
    setActiveOccupation(occupationData);
  };

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
    <>
      <ManufacturingSelect
        activeMap={activeMap}
        getCareerMap={getCareerMap}
        industry={thisIndustry}
        setActiveOccupation={setActiveOccupation}
        setActivePathway={setActivePathway}
        setFullMap={setFullMap}
        setMapOpen={setMapOpen}
        setOpen={setOpen}
      />

      <OccupationGroups
        activeOccupation={activeOccupation}
        activeMap={activeMap}
        industry={thisIndustry}
        getOccupation={getOccupation}
        open={open}
        setActivePathway={setActivePathway}
        setMapOpen={setMapOpen}
        setOpen={setOpen}
      />
      <div
        className={`careerPathways container${activeMap ? "" : " disabled"}`}
      >
        {hasPathways && activeMap ? (
          <>
            {activeOccupation && (
              <>
                <div id="map-block" className="map-block">
                  <Button
                    tag
                    type="button"
                    iconWeight="bold"
                    iconPrefix={mapOpen ? "ArrowsInSimple" : "ArrowsOutSimple"}
                    onClick={() => {
                      setMapOpen(!mapOpen);
                    }}
                  >
                    {mapOpen ? "Collapse" : "Expand"}
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
                                          className={
                                            isTall ? "tall" : undefined
                                          }
                                        >
                                          {path.map((occupation) => {
                                            const isActive =
                                              activeOccupation.careerMapObject
                                                .sys.id === occupation.sys.id;
                                            return (
                                              <button
                                                key={`occ${occupation.sys.id}`}
                                                type="button"
                                                onClick={() => {
                                                  setMapOpen(false);

                                                  setActivePathway(pathItem);

                                                  getOccupation(
                                                    occupation.sys.id,
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
                                                {!!occupation.salaryRangeStart && (
                                                  <div className="salary">
                                                    <p>Salary Range</p>
                                                    <p>
                                                      <strong>
                                                        $
                                                        {numberShorthand(
                                                          occupation.salaryRangeStart,
                                                        )}{" "}
                                                        - $
                                                        {numberShorthand(
                                                          occupation.salaryRangeEnd,
                                                        )}
                                                      </strong>
                                                    </p>
                                                  </div>
                                                )}
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
                </div>
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
    </>
  );
};
