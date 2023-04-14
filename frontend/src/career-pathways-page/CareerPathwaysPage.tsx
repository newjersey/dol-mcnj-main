import { ReactElement, useEffect, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { CareerPathwaysPageData, IndustryProps } from "../types/contentful";
import { Layout } from "../components/Layout";
import { IndustrySelector } from "../components/IndustrySelector";
import { OverlayTool } from "../components/OverlayTool";
import image from "../overlayImages/career-pathways.png";
import { FooterCta } from "../components/FooterCta";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const CareerPathwaysPage = (props: Props): ReactElement<Props> => {
  const [data, setData] = useState<CareerPathwaysPageData>();
  const [industry, setIndustry] = useState<IndustryProps>();

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
        }
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${JSON.stringify(e)}`);
      },
    });
  }, [props.client, props.id]);

  return (
    <Layout
      client={props.client}
      theme="support"
      footerComponent={
        data && <FooterCta heading={data.page.footerCtaHeading} link={data.page.footerCtaLink} />
      }
    >
      <OverlayTool img={image} />
      {data && (
        <>
          <PageBanner {...data.page.pageBanner} date={data.page.sys.publishedAt} />
          <IndustrySelector industries={data.industries.items} />
        </>
      )}
    </Layout>
  );
};
