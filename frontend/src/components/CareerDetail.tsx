import { useEffect, useState } from "react";
import { contentfulClient } from "../utils/contentfulClient";
import { JobCountProps, OccupationNodeProps, SelectProps } from "../types/contentful";
import { OCCUPATION_QUERY } from "../queries/occupation";
import {
  ArrowSquareOut,
  ArrowUpRight,
  ArrowsInSimple,
  ArrowsOutSimple,
  Briefcase,
  Info,
  RocketLaunch,
  X,
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
import { Tooltip } from "@material-ui/core";

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
  const [map, setMap] = useState<MapProps[]>();
  const [filteredMap, setFilteredMap] = useState<MapProps[]>();

  useEffect(() => {
    setFilteredMap(map?.filter((path) => path.title !== selected?.pathTitle));
  }, [map]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* eslint-disable-next-line  */
        const result: any = await contentfulClient({
          query: OCCUPATION_QUERY,
          variables: { id: detailsId },
        });
        setData(result);

        const searchTerm =
          result.careerMapObject.trainingSearchTerms || result.careerMapObject.title;

        client.getJobCount(searchTerm, {
          onSuccess: (count) => {
            setJobCount(count);
          },
          onError: (error) => {
            console.error(error);
          },
        });
      } catch (error) {
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

  return (
    <>
      {data && (
        <div className="career-detail occupation-block">
          <div className="container plus">
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
              {mapOpen ? (
                <ArrowsInSimple size={25} weight="bold" />
              ) : (
                <ArrowsOutSimple size={25} weight="bold" />
              )}
              See {mapOpen ? "less" : "full"} <strong>{groupTitle} Pathways</strong>
              map
            </button>
          </div>

          <div className="occupation-box">
            <div className="container plus">
              <div className={`full-map${map && mapOpen ? " open" : ""}`} id="full-career-map">
                <button className="close" onClick={() => setMapOpen(false)}>
                  <X size={25} />
                </button>
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
                          setFilteredMap(map?.filter((path) => path.title !== selected?.pathTitle));
                        }}
                      />
                    ))}
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
                  {data.careerMapObject.description && <p>{data.careerMapObject.description}</p>}
                </div>
                <div className="meta">
                  <div>
                    <p className="title">
                      Median Salary{" "}
                      <Tooltip placement="top" title="TEST">
                        <Info size={20} weight="fill" />
                      </Tooltip>
                    </p>
                    <p>
                      {data.careerMapObject.medianSalary
                        ? toUsCurrency(data.careerMapObject.medianSalary)
                        : "---"}
                    </p>
                  </div>
                  <div>
                    <p className="title">
                      Jobs Open in NJ{" "}
                      <Tooltip placement="top" title="TEST">
                        <Info size={20} weight="fill" />
                      </Tooltip>
                    </p>
                    <p>
                      <strong>{jobCount ? numberWithCommas(jobCount.count) : "---"}</strong>
                    </p>
                    <a
                      href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${
                        data.careerMapObject.trainingSearchTerms || data.careerMapObject.title
                      }&amp;location=New%20Jersey&amp;radius=0&amp;source=NLX&amp;currentpage=1`}
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
                      href={`/search/${data.careerMapObject.title.toLowerCase()}`}
                    >
                      <span>
                        <Selector name="trainingBold" />
                        See more trainings on the Training Explorer
                      </span>
                      <ArrowUpRight size={20} />
                    </a>
                    <a className="usa-button" href="/tuition-assistance">
                      <span>
                        <Selector name="supportBold" />
                        Learn more financial assistance opportunities
                      </span>
                      <ArrowUpRight size={20} />
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
                      href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${data.careerMapObject.title.toLowerCase()}&location=New%20Jersey&radius=0&source=NLX&currentpage=1&pagesize=100`}
                    >
                      <span>
                        <Briefcase size={32} />
                        Check out related jobs on Career One Stop
                      </span>
                      <ArrowUpRight size={20} />
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
