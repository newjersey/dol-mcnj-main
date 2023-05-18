import { useEffect, useState } from "react";
import { contentfulClient } from "../utils/contentfulClient";
import { OccupationNodeProps } from "../types/contentful";
import { OCCUPATION_QUERY } from "../queries/occupation";
import { ArrowSquareOut, Briefcase, Fire, RocketLaunch } from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import { Client } from "../domain/Client";
import { OccupationCopyColumn } from "./modules/OccupationCopyColumn";
import { RelatedTrainingSearch } from "./modules/RelatedTrainingSearch";

interface OccupationDataProps {
  careerMapObject: OccupationNodeProps;
}

export const CareerDetail = ({ detailsId, client }: { detailsId: string; client: Client }) => {
  const [data, setData] = useState<OccupationDataProps>();

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
  }, [detailsId]);

  return (
    <>
      {data && (
        <div className="career-detail occupation-block">
          <div className="container plus">
            <div className="occupation-box">
              <div className="heading">
                <h3>{data.careerMapObject.title}</h3>
                {data.careerMapObject.inDemand && (
                  <span className="tag">
                    <Fire size={15} />
                    &nbsp; In-Demand
                  </span>
                )}
                {data.careerMapObject.description && <p>{data.careerMapObject.description}</p>}
              </div>
              {data.careerMapObject.tasks && (
                <div className="box">
                  <div className="heading-bar">
                    <Briefcase size={25} />
                    What do they do?
                  </div>
                  <div className="content">
                    <ReactMarkdown>{`${data.careerMapObject.tasks}`}</ReactMarkdown>
                  </div>
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
        </div>
      )}
    </>
  );
};
