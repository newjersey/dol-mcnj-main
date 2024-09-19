import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { CareerPathwaysPageData, IndustryProps, ThemeColors } from "../types/contentful";
import { Layout } from "../components/Layout";
import { IndustrySelector } from "../components/IndustrySelector";
import { IndustryBlock } from "../components/IndustryBlock";
import { OccupationDetail } from "../domain/Occupation";
import { Error } from "../domain/Error";
import { OccupationBlock } from "../components/OccupationBlock";
import { useContentful } from "../utils/useContentful";
import { CareerPathways } from "../components/CareerPathways";
import { NotFoundPage } from "../error/NotFoundPage";
import { CtaBanner } from "../components/CtaBanner";
import { HowToUse } from "../components/modules/HowToUse";
import { usePageTitle } from "../utils/usePageTitle";
import pageImage from "../images/ogImages/careerPathways.png";

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

  const exploreLinks = data?.page.exploreButtonsCollection.items.map((link, index: number) => {
    const highlight =
      (index + 1) % 4 === 1
        ? "purple"
        : (index + 1) % 4 === 2
          ? "orange"
          : (index + 1) % 4 === 3
            ? "blue"
            : "green";
    return {
      ...link,
      iconPrefix: link.icon,
      highlight: highlight as ThemeColors,
    };
  });

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
      ? `${data?.page.title} | ${process.env.REACT_APP_SITE_NAME}`
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

  return (
    <>
      {data && (
        <Layout
          client={props.client}
          theme="support"
          noPad
          className="career-pathways-page"
          seo={seoObject}
        >
          {!industry ? (
            <>
              <IndustrySelector />
              <CtaBanner
                heading={data.page.exploreHeading}
                headingLevel={3}
                theme="purple"
                fullColor
                links={exploreLinks}
              />
            </>
          ) : (
            <>
              <IndustryBlock {...industry} />
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
            </>
          )}
        </Layout>
      )}
      <HowToUse />
    </>
  );
};
