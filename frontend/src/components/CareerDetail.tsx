import { useEffect, useState } from "react";
import { contentfulClient } from "../utils/contentfulClient";
import { PATHWAY_QUERY } from "../queries/pathway";
import { OccupationNodeProps, SinglePathwayProps } from "../types/contentful";
import { OCCUPATION_QUERY } from "../queries/occupation";
import { ArrowSquareOut, Briefcase, Fire, RocketLaunch } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import { Client } from "../domain/Client";
import { OccupationCopyColumn } from "./modules/OccupationCopyColumn";
import { RelatedTrainingSearch } from "./modules/RelatedTrainingSearch";

interface PathwayDataProps {
  pathway: SinglePathwayProps;
}

interface OccupationDataProps {
  careerMapObject: OccupationNodeProps;
}

export const CareerDetail = ({ mapId, client }: { mapId: string; client: Client }) => {
  const [data, setData] = useState<PathwayDataProps>();
  const [activeOccupation, setActiveOccupation] = useState<string>("");
  const [occupationData, setOccupationData] = useState<OccupationDataProps>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* eslint-disable-next-line  */
        const result: any = await contentfulClient({
          query: PATHWAY_QUERY,
          variables: { id: mapId },
        });
        setData(result);
      } catch (error) {
        console.error(error);
        return {};
      }
    };

    fetchData();
  }, [mapId]);

  useEffect(() => {
    if (data) {
      const activeOccupation = data.pathway.occupationsCollection.items[0];
      setActiveOccupation(activeOccupation.sys.id);
    }
  }, [data]);

  useEffect(() => {
    if (activeOccupation) {
      const fetchData = async () => {
        try {
          /* eslint-disable-next-line  */
          const result: any = await contentfulClient({
            query: OCCUPATION_QUERY,
            variables: { id: activeOccupation },
          });
          setOccupationData(result);
        } catch (error) {
          console.error(error);

          return {};
        }
      };
      fetchData();
    }
  }, [activeOccupation]);

  return (
    <>
      {occupationData && (
        <div className="career-detail occupation-block">
          <div className="container plus">
            <div className="occupation-box">
              <div className="heading">
                <h3>{occupationData.careerMapObject.title}</h3>
                {occupationData.careerMapObject.inDemand && (
                  <span className="tag">
                    <Fire size={15} />
                    &nbsp; In-Demand
                  </span>
                )}
                {occupationData.careerMapObject.description && (
                  <p>{occupationData.careerMapObject.description}</p>
                )}
              </div>
              {occupationData.careerMapObject.tasks && (
                <div className="box">
                  <div className="heading-bar">
                    <Briefcase size={25} />
                    What do they do?
                  </div>
                  <div className="content">
                    <ReactMarkdown>{`${occupationData.careerMapObject.tasks}`}</ReactMarkdown>
                  </div>
                </div>
              )}
              <div className="occu-row related">
                <div>
                  <OccupationCopyColumn {...occupationData.careerMapObject} />
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
                          query={occupationData.careerMapObject.title}
                          client={client}
                        />
                      </ul>
                      <a
                        className="usa-button"
                        href={`/search/${occupationData.careerMapObject.title.toLowerCase()}`}
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
                        href={`https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=${occupationData.careerMapObject.title.toLowerCase()}&location=New%20Jersey&radius=0&source=NLX&currentpage=1&pagesize=100`}
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
        </div>
      )}
    </>
  );
};
