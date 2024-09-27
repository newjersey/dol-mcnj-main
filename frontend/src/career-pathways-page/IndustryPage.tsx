import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { CareerPathwaysPageData, IndustryProps } from "../types/contentful";
import { Layout } from "../components/Layout";
import { OccupationDetail } from "../domain/Occupation";
import { Error } from "../domain/Error";
import { OccupationBlock } from "../components/OccupationBlock";
import { useContentful } from "../utils/useContentful";
import { CareerPathways } from "../components/CareerPathways";
import { NotFoundPage } from "../error/NotFoundPage";
import { usePageTitle } from "../utils/usePageTitle";
import pageImage from "../images/ogImages/careerPathways.png";
import { Heading } from "../components/modules/Heading";
import { Icon } from "@material-ui/core";
import { ArrowLeft } from "@phosphor-icons/react";

interface Props extends RouteComponentProps {
  client: Client;
  slug?: string;
}

export const IndustryPage = (props: Props): ReactElement<Props> => {
  const [industry, setIndustry] = useState<IndustryProps>();
  const [occupation, setOccupation] = useState<string>();
  const [occupationDetail, setOccupationDetail] = useState<OccupationDetail>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>();

  const data: CareerPathwaysPageData = useContentful({ path: "/career-pathways" });
  const industryData: {
    industryCollection: {
      items: IndustryProps[];
    };
  } = useContentful({
    path: `/industry/${props.slug}`,
  });

  useEffect(() => {
    if (industryData) {
      setIndustry(industryData?.industryCollection.items[0]);
    }
  }, [industryData]);

  usePageTitle(`${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`);

  useEffect(() => {
    if ((occupation !== undefined || occupation !== null || occupation !== "") && occupation) {
      setLoading(true);
      props.client.getOccupationDetailBySoc(occupation, {
        onSuccess: (result: OccupationDetail) => {
          setLoading(false);
          setError(undefined);
          setOccupationDetail(result);
        },
        onError: (error: Error) => {
          setLoading(false);
          setError(error);
        },
      });
    }
  }, [occupation]);

  if (props.slug && industryData?.industryCollection?.items.length === 0) {
    return <NotFoundPage client={props.client} />;
  }

  const breadcrumbs = data
    ? { items: [...data.page.pageBanner.breadcrumbsCollection.items] }
    : { items: [] };

  if (props.slug && industry) {
    breadcrumbs.items.push({
      copy: "NJ Career Pathways",
      url: `/career-pathways`,
      sys: {
        id: industry.sys.id,
      },
    });
  }

  const seoObject = {
    title: data
      ? `${industry ? `${industry.title} | ` : ""}${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`
      : `Career Pathways | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      data?.page.pageDescription ||
      "Explore popular industries and careers in the state of New Jersey.",
    image: data?.page.ogImage?.url || pageImage,
    keywords: data?.page.keywords || [
      "New Jersey",
      "Career",
      "Job",
      "Training",
      "New Jersey Career Central",
      "Career Pathways",
    ],
    url: props.location?.pathname || "/career-pathways",
  };

  const hasMaps = industry?.careerMaps?.items && industry?.careerMaps?.items.length > 0;

  return (
    <>
      {data && industry && (
        <Layout
          client={props.client}
          theme="support"
          noPad
          className="industry-pathways-page"
          seo={seoObject}
        >
          <section className="banner">
            <div className="container">
              <div className="inner">
                <div className="top-nav">
                  <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
                    <Icon>keyboard_backspace</Icon>
                    <ol className="usa-breadcrumb__list">
                      <li className="usa-breadcrumb__list-item">
                        <a className="usa-breadcrumb__link" href="/">
                          Home
                        </a>
                      </li>
                      <li className="usa-breadcrumb__list-item">
                        <a className="usa-breadcrumb__link" href="/career-pathways">
                          {data.page.title}
                        </a>
                      </li>

                      <li className="usa-breadcrumb__list-item use-current" aria-current="page">
                        <span data-testid="title">
                          Select a {industry.title} {hasMaps ? "Field" : "occupation"}
                        </span>
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="content">
                  <a className="back-link" href="/career-pathways">
                    <ArrowLeft size={24} />
                    Back
                  </a>
                  {hasMaps && <Heading level={1}>{`Select a ${industry.title} Field`}</Heading>}
                </div>
              </div>
            </div>
          </section>

          <div id="industry-container">
            {industry.careerMaps?.items && industry.careerMaps?.items.length > 0 ? (
              <CareerPathways
                careerMaps={industry.careerMaps.items}
                icon={industry?.slug}
                industry={industry.title}
                client={props.client}
              />
            ) : (
              <>
                {industry.inDemandCollection?.items &&
                  industry.inDemandCollection?.items.length > 0 && (
                    <OccupationBlock
                      content={occupationDetail}
                      industry={industry.shorthandTitle || industry.title}
                      inDemandList={industry.inDemandCollection?.items}
                      setOccupation={setOccupation}
                      error={error}
                      loading={loading}
                    />
                  )}
              </>
            )}
          </div>
        </Layout>
      )}
    </>
  );
};
