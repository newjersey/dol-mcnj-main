import { useEffect, useState } from "react";
import { JobCountProps, OccupationNodeProps, SelectProps } from "../types/contentful";
import {
  ArrowsInSimple,
  ArrowsOutSimple,
  ArrowSquareOut,
  Briefcase,
  Info,
  RocketLaunch,
} from "@phosphor-icons/react";
import { Client } from "../domain/Client";
import { OccupationCopyColumn } from "./modules/OccupationCopyColumn";
import { RelatedTrainingSearch } from "./modules/RelatedTrainingSearch";
import { groupObjectsByLevel } from "../utils/groupObjectsByLevel";
import { SinglePath } from "./SinglePath";
import { toUsCurrency } from "../utils/toUsCurrency";
import { numberWithCommas } from "../utils/numberWithCommas";
import { Selector } from "../svg/Selector";
import { InDemandTag } from "./InDemandTag";
import { CircularProgress } from "@material-ui/core";
import { parseMarkdownToHTML } from "../utils/parseMarkdownToHTML";

interface OccupationDataProps {
  careerMapObject: OccupationNodeProps;
}

interface MapProps {
  title: string;
  groups: OccupationNodeProps[][];
}

export const CareerDetail = ({
  detailsId,
  client,
  breadcrumbs,
  pathway,
  groupTitle,
  selected,
  setSelected,
  mapOpen,
  setMapOpen,
}: {
  detailsId: string;
  client: Client;
  groupTitle?: string;
  mapOpen: boolean;
  setMapOpen: (open: boolean) => void;
  breadcrumbs: {
    industry: string;
    group?: string;
    pathway?: string;
  };
  pathway?: OccupationNodeProps[];
  setSelected: (id: SelectProps) => void;
  selected?: SelectProps;
}) => {
  const [data, setData] = useState<OccupationDataProps>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jobCount, setJobCount] = useState<JobCountProps>();
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [map, setMap] = useState<MapProps[]>();
  const [filteredMap, setFilteredMap] = useState<MapProps[]>();

  useEffect(() => {
    setFilteredMap(map?.filter((path) => path.title !== selected?.pathTitle));
  }, [map]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingJobs(true);
      try {
        /* eslint-disable-next-line  */
        const result: any = await fetch(`/api/contentful/career-map-occupation/${detailsId}`);
        const resultJson = await result.json();
        setData(resultJson);

        const searchTerm =
          resultJson.careerMapObject.trainingSearchTerms || resultJson.careerMapObject.title;

        client.getJobCount(searchTerm, {
          onSuccess: (count) => {
            setJobCount(count);
            setLoadingJobs(false);
          },
          onError: (error) => {
            console.error(error);
            setLoadingJobs(false);
          },
        });
      } catch (error) {
        setLoadingJobs(false);
        console.error(error);
        return {};
      }
    };

    fetchData();

    const fullMap = localStorage.getItem("fullMap");
    if (fullMap) {
      setMap(JSON.parse(fullMap));
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMapOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
  }, [detailsId]);

  const groupedArray: OccupationNodeProps[][] = groupObjectsByLevel(pathway || []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (document.getElementById("uswds") !== null) return;

      const script = document.createElement("script");
      script.src = "https://newjersey.github.io/njwds/dist/js/uswds.min.js";
      script.id = "uswds";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [data]);

  return (
    <>
      {data && (
        <div className="career-detail occupation-block">
          <div className="occupation-box">
            <div className="container">
              <div id="map-block" className="map-block">
                <button
                  className="explore-button"
                  type="button"
                  onClick={() => {
                    setMapOpen(!mapOpen);
                    const element = document.querySelector(
                      ".full-map .path-stop.active",
                    ) as HTMLElement;
                    setTimeout(() => {
                      element.focus();
                    }, 100);
                  }}
                >
                  {mapOpen ? <ArrowsInSimple size={25} /> : <ArrowsOutSimple size={25} />}
                  {mapOpen ? "Collapse" : "Expand"} <strong>{groupTitle} Pathways </strong>map
                </button>
                <div className={`full-map${map && mapOpen ? " open" : ""}`} id="full-career-map">
                  <div className="inner">
                    <SinglePath
                      heading={selected?.pathTitle}
                      items={groupedArray}
                      setSelected={setSelected}
                      setOpen={setMapOpen}
                      onClick={() => {
                        setFilteredMap(map?.filter((path) => path.title !== selected?.pathTitle));
                      }}
                    />
                    <div className="extra">
                      {filteredMap?.map((path) => (
                        <SinglePath
                          key={path.title}
                          heading={path.title}
                          items={path.groups}
                          setSelected={setSelected}
                          setOpen={setMapOpen}
                          onClick={() => {
                            setFilteredMap(
                              map?.filter((path) => path.title !== selected?.pathTitle),
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="breadcrumbs">
                <span>{breadcrumbs.industry}</span> / <span>{breadcrumbs.group}</span> /{" "}
                <span>{breadcrumbs.pathway}</span>
              </div>

              <div className="heading">
                <div>
                  <h3>{data.careerMapObject.title}</h3>
                  {data.careerMapObject.inDemand && <InDemandTag />}
                  {data.careerMapObject.description && (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdownToHTML(data.careerMapObject.description),
                      }}
                    />
                  )}
                </div>
                <div className="meta">
                  <div>
                    <p className="title">
                      Expected Entry Level Salary
                      <button
                        data-position="top"
                        onFocus={(e) => e.preventDefault()}
                        title="This salary range is an estimate based on available data and may vary depending on location, experience, and employer."
                        id="sal-tooltip"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        type="button"
                        className="unstyled usa-tooltip"
                      >
                        <Info size={20} weight="fill" />
                      </button>
                    </p>
                    <p>
                      <strong>
                        {data.careerMapObject.salaryRangeStart &&
                        data.careerMapObject.salaryRangeEnd
                          ? `${toUsCurrency(data.careerMapObject.salaryRangeStart)} - ${toUsCurrency(
                              data.careerMapObject.salaryRangeEnd,
                            )}`
                          : data.careerMapObject.salaryRangeStart
                            ? toUsCurrency(data.careerMapObject.salaryRangeStart)
                            : "Salary data not available"}
                      </strong>
                    </p>
                  </div>
                  <div>
                    <p className="title">
                      Jobs Open in NJ{" "}
                      <button
                        onFocus={(e) => e.preventDefault()}
                        data-position="top"
                        id="jobs-tooltip"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        title="Job openings are based on postings from the NLx job board and reflect positions in New Jersey. The actual number of available jobs may vary."
                        type="button"
                        className="unstyled usa-tooltip"
                      >
                        <Info size={20} weight="fill" />
                      </button>
                    </p>
                    <>
                      {loadingJobs ? (
                        <CircularProgress
                          size={22}
                          style={{
                            margin: "0 0 18px",
                            padding: 0,
                          }}
                        />
                      ) : (
                        <p>
                          <strong>{jobCount ? numberWithCommas(jobCount.count) : "---"}</strong>
                        </p>
                      )}
                    </>
                    <a
                      href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${
                        data.careerMapObject.trainingSearchTerms || data.careerMapObject.title
                      }&location=New%20Jersey&radius=25&source=NLX&curPage=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>See current job openings</span>
                      <ArrowSquareOut size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="occu-row related">
              <div>
                <OccupationCopyColumn {...data.careerMapObject} />
              </div>
              <div>
                <div className="box">
                  <div className="heading-bar">
                    <RocketLaunch size={32} />
                    Related Training Opportunities
                  </div>

                  <div className="content related-training">
                    <ul className="unstyled">
                      <RelatedTrainingSearch
                        query={
                          data.careerMapObject.trainingSearchTerms || data.careerMapObject.title
                        }
                        client={client}
                      />
                    </ul>
                    <a
                      className="usa-button"
                      target="_blank"
                      href={`/training/search?q=${data.careerMapObject.title.toLowerCase()}`}
                      rel="noopener noreferrer"
                    >
                      <span>
                        <Selector name="trainingBold" />
                        See more trainings on the Training Explorer
                      </span>
                    </a>
                    <a
                      className="usa-button"
                      href="/support-resources/tuition-assistance"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        <Selector name="supportBold" />
                        Learn more financial assistance opportunities
                      </span>
                    </a>
                  </div>
                </div>
                <div className="box related-jobs">
                  <div className="heading-bar">
                    <Briefcase size={32} />
                    Related Job Opportunities
                  </div>
                  <div className="content">
                    <a
                      className="usa-button usa-button--secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${data.careerMapObject.title.toLowerCase()}&location=New%20Jersey&radius=0&source=NLX&currentpage=1&pagesize=100`}
                    >
                      <span>
                        <Briefcase size={32} />
                        Check out related jobs on Career One Stop
                      </span>
                      <ArrowSquareOut size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
