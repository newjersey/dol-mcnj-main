import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { CareerPathwaysPageData, IndustryProps, ThemeColors } from "../types/contentful";
import { Layout } from "../components/Layout";
import { IndustrySelector } from "../components/IndustrySelector";
import { IndustryBlock } from "../components/IndustryBlock";
import { IndustryOccupation } from "../components/IndustryOccupation";
import { OccupationDetail } from "../domain/Occupation";
import { Error } from "../domain/Error";
import { OccupationBlock } from "../components/OccupationBlock";
import { useContentfulClient } from "../utils/useContentfulClient";
import { CAREER_PATHWAYS_PAGE_QUERY } from "../queries/careerPathways";
import { INDUSTRY_QUERY } from "../queries/industry";
import { CareerPathways } from "../components/CareerPathways";
import { NotFoundPage } from "../error/NotFoundPage";
import { CtaBanner } from "../components/CtaBanner";
import { SectionHeading } from "../components/modules/SectionHeading";
import { Stepper } from "../components/Stepper";
import { HowToUse } from "../components/modules/HowToUse";

interface Props extends RouteComponentProps {
  client: Client;
  slug?: string;
}

export const CareerPathwaysPage = (props: Props): ReactElement<Props> => {
  const [industry, setIndustry] = useState<IndustryProps>();
  const [occupation, setOccupation] = useState<string>();
  const [occupationDetail, setOccupationDetail] = useState<OccupationDetail>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>();

  const data: CareerPathwaysPageData = useContentfulClient({ query: CAREER_PATHWAYS_PAGE_QUERY });
  const industryData: {
    industryCollection: {
      items: IndustryProps[];
    };
  } = useContentfulClient({
    disable: !props.slug,
    query: INDUSTRY_QUERY,
    variables: { slug: props.slug },
  });

  useEffect(() => {
    if (industryData) {
      console.log(industryData)
      setIndustry(industryData?.industryCollection.items[0]);
    }
  }, [industryData]);

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

  const industryOccupations = (industry?: IndustryProps) => {
    if (!industry) {
      return (
        <>
          <section className="landing">
            <div className="container plus">
              {data.page.stepsHeading && <SectionHeading heading={data.page.stepsHeading} />}
            </div>
            <div className="container plus">
              <div className="steps">
                {data.page.stepsCollection && (
                  <Stepper theme="purple" steps={data.page.stepsCollection.items} />
                )}
              </div>
            </div>
          </section>
          <CtaBanner
            heading={data.page.exploreHeading}
            headingLevel={3}
            theme="purple"
            fullColor
            links={exploreLinks}
          />
        </>
      )
    } else if (industry.careerMaps?.items && industry.careerMaps?.items.length > 0) {
      return (
        <>
          <IndustryBlock {...industry} />
          <div id="industry-container">
            <CareerPathways
              careerMaps={industry.careerMaps.items}
              icon={industry?.slug}
              industry={industry.title}
              client={props.client}
            />
          </div>
        </>
      )
    } else if (industry.occupationsCollection?.items && industry.occupationsCollection?.items.length > 0) {
      return (
        <>
          <IndustryBlock {...industry} />
          <IndustryOccupation
            industryTitle={industry.shorthandTitle || industry.title}
            occupationDetails={industry.occupationsCollection?.items}
            client={props.client}
          />
        </>
      )
    } else if (industry.inDemandCollection?.items && industry.inDemandCollection?.items.length > 0) {
      return (
        <>
          <IndustryBlock {...industry} />
          <div id="industry-container">
            <OccupationBlock
              content={occupationDetail}
              industry={industry.shorthandTitle || industry.title}
              inDemandList={industry.inDemandCollection?.items}
              setOccupation={setOccupation}
              error={error}
              loading={loading}
            />
          </div>
        </>
      )
    } else {
      return <NotFoundPage client={props.client} />;
    }
  };

  return (
    <>
      {data && (
        <Layout client={props.client} theme="support" noPad className="career-pathways-page">
          <PageBanner
            {...data.page.pageBanner}
            breadcrumbsCollection={breadcrumbs}
            breadcrumbTitle={industry?.title}
          />
          <IndustrySelector industries={data.page.industries.items} current={industry?.slug} />
          {industryOccupations(industry)}
        </Layout>
      )}
      <HowToUse />
    </>
  );
};
