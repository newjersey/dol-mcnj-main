import { useEffect, useState } from "react";
import { contentfulClient } from "../utils/contentfulClient";
import { OccupationNodeProps, SelectProps } from "../types/contentful";
import { OCCUPATION_QUERY } from "../queries/occupation";
import {
  ArrowSquareOut,
  Briefcase,
  ChartLineUp,
  Info,
  RocketLaunch,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { Client } from "../domain/Client";
import { OccupationCopyColumn } from "./modules/OccupationCopyColumn";
import { RelatedTrainingSearch } from "./modules/RelatedTrainingSearch";
import { groupObjectsByLevel } from "../utils/groupObjectsByLevel";
import { SinglePath } from "./SinglePath";
import { toUsCurrency } from "../utils/toUsCurrency";
import { numberWithCommas } from "../utils/numberWithCommas";
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
  setSelected,
}: {
  detailsId: string;
  client: Client;
  groupTitle: string;
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
  const [map, setMap] = useState<MapProps[]>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* eslint-disable-next-line  */
        const result: any = await contentfulClient({
          query: OCCUPATION_QUERY,
          variables: { id: detailsId },
        });
        setData(result);
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
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
  }, [detailsId]);

  const groupedArray: OccupationNodeProps[][] = groupObjectsByLevel(pathway || []);

  return (
    <>
      {data && (
        <div className="career-detail occupation-block">
          <div className={`full-map${map && open ? " open" : ""}`} id="full-career-map">
            <button className="close" onClick={() => setOpen(false)}>
              <X size={25} />
            </button>
            <div className="inner">
              <div className="container">
                <p className="map-title">{groupTitle} Career Pathways</p>
                {map?.map((path) => (
                  <SinglePath
                    key={path.title}
                    items={path.groups}
                    setSelected={setSelected}
                    setOpen={setOpen}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="occupation-box">
            <div className="breadcrumbs">
              <span>{breadcrumbs.industry}</span> / <span>{breadcrumbs.group}</span> /{" "}
              <span>{breadcrumbs.pathway}</span>
            </div>
            <div className="heading">
              <div>
                <h3>{data.careerMapObject.title}</h3>
                {data.careerMapObject.inDemand && (
                  <span className="tag">
                    <ChartLineUp size={15} />
                    &nbsp; In-Demand
                  </span>
                )}
                {data.careerMapObject.description && <p>{data.careerMapObject.description}</p>}
              </div>
              <div className="meta">
                <div>
                  <p className="title">
                    Median Salary <WarningCircle size={20} weight="fill" />
                  </p>
                  <p>
                    {data.careerMapObject.medianSalary
                      ? toUsCurrency(data.careerMapObject.medianSalary)
                      : "---"}
                  </p>
                </div>
                <div>
                  <p className="title">
                    Jobs Open in NJ <WarningCircle size={20} weight="fill" />
                  </p>
                  <p>
                    {data.careerMapObject.numberOfAvailableJobs
                      ? numberWithCommas(data.careerMapObject.numberOfAvailableJobs)
                      : "---"}
                  </p>
                  <a
                    href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${
                      data.careerMapObject.trainingSearchTerms || data.careerMapObject.title
                    }&amp;location=New%20Jersey&amp;radius=0&amp;source=NLX&amp;currentpage=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    See current job openings
                  </a>
                </div>
              </div>
            </div>
            <SinglePath items={groupedArray} setSelected={setSelected} />
            <button
              className="map-toggle"
              type="button"
              onClick={() => {
                setOpen(!open);
                const element = document.querySelector(
                  ".full-map .path-stop.active"
                ) as HTMLElement;
                setTimeout(() => {
                  element.focus();
                }, 100);
              }}
            >
              <Info size={25} />
              View the full {groupTitle} pathway
            </button>
            {data.careerMapObject.tasks && (
              <div className="box">
                <div className="heading-bar">
                  <Briefcase size={25} />
                  What do they do?
                </div>

                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: parseMarkdownToHTML(data.careerMapObject.tasks),
                  }}
                />
              </div>
            )}
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
                      See more trainings on the Training Explorer
                      <ArrowSquareOut size={20} />
                    </a>
                    <a className="usa-button" href="/tuition-assistance">
                      Learn more financial assistance opportunities
                      <ArrowSquareOut size={20} />
                    </a>
                  </div>
                </div>
                <div className="box">
                  <div className="heading-bar">
                    <Briefcase size={32} />
                    Related Job Opportunities
                  </div>
                  <div className="content">
                    <a
                      className="usa-button usa-button--secondary"
                      href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${data.careerMapObject.title.toLowerCase()}&location=New%20Jersey&radius=0&source=NLX&currentpage=1&pagesize=100`}
                    >
                      Check out related jobs on Career One Stop
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
