import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { CareerPathwaysPageData, IndustryProps } from "../types/contentful";
import { Layout } from "../components/Layout";
import { IndustrySelector } from "../components/IndustrySelector";
import { FooterCta } from "../components/FooterCta";
import { IndustryBlock } from "../components/IndustryBlock";
import { OccupationDetail } from "../domain/Occupation";
import { Error } from "../domain/Error";
// import image from "../overlayImages/healthcare-mobile.png";
// import { OverlayTool } from "../components/OverlayTool";
import { OccupationBlock } from "../components/OccupationBlock";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const CareerPathwaysPage = (props: Props): ReactElement<Props> => {
  const [data, setData] = useState<CareerPathwaysPageData>();
  const [industry, setIndustry] = useState<IndustryProps>();
  const [occupation, setOccupation] = useState<string>();
  const [occupationDetail, setOccupationDetail] = useState<OccupationDetail>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    props.client.getContentfulCPW("cpw", {
      onSuccess: (response: {
        data: {
          data: CareerPathwaysPageData;
        };
      }) => {
        setData(response.data.data);
        if (props.id) {
          const industry = response.data.data.industries.items.find(
            (industry) => industry.slug === props.id
          );
          setIndustry(industry);

          if (
            (occupation !== undefined || occupation !== null || occupation !== "") &&
            occupation
          ) {
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
        }
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${JSON.stringify(e)}`);
      },
    });
  }, [props.client, props.id, occupation]);

  return (
    <Layout
      client={props.client}
      theme="support"
      footerComponent={
        data && <FooterCta heading={data.page.footerCtaHeading} link={data.page.footerCtaLink} />
      }
    >
      {data && (
        <>
          <PageBanner {...data.page.pageBanner} date={data.page.sys.publishedAt} />
          <IndustrySelector industries={data.industries.items} current={industry?.slug} />
          {industry && (
            <>
              <IndustryBlock {...industry} />

              <OccupationBlock
                content={occupationDetail}
                industry={industry.title}
                inDemandList={industry.inDemandCollection?.items}
                setOccupation={setOccupation}
                error={error}
                loading={loading}
              />
            </>
          )}
        </>
      )}
    </Layout>
  );
};
