import { RouteComponentProps } from "@reach/router";
import { ReactElement, useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Client } from "../domain/Client";
import { FinancialResourcePageData, FinancialResourcePageProps } from "../types/contentful";
import { PageBanner } from "../components/PageBanner";
import { FinancialResourceFilter } from "../components/FinancialResourceFilter";
import { FinancialResource } from "../components/FinancialResource";
import { ContentfulRichText } from "../components/ContentfulRichText";

interface Props extends RouteComponentProps {
  client: Client;
}

export const FinancialPage = (props: Props): ReactElement => {
  const [data, setData] = useState<FinancialResourcePageData>();
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    props.client.getContentfulFRP("frp", {
      onSuccess: (response: FinancialResourcePageProps) => {
        setData(response.data.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
  }, [props.client]);

  const breadCrumbs = [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Financial Resources",
    },
  ];

  // function that filters data.resources based on activeTags

  const getFilteredResources = () => {
    if (activeTags.length === 0) {
      return data?.resources.items;
    }

    return data?.resources.items.filter((resource) => {
      return resource.taggedCatsCollection.items.some((tag) => {
        return activeTags.includes(`${tag.sys?.id}`);
      });
    });
  };

  return (
    <Layout
      client={props.client}
      footerComponent={
        data?.page.footerBannerTitle && data?.page.footerBannerCopy ? (
          <div className="footer-banner">
            <div className="container">
              <h3>{data?.page.footerBannerTitle}</h3>
              <ContentfulRichText document={data?.page.footerBannerCopy?.json} />
            </div>
          </div>
        ) : undefined
      }
    >
      <PageBanner
        breadCrumbs={breadCrumbs}
        heading={`${data?.page.bannerHeading}`}
        image={`${data?.page.bannerImage?.url}`}
        message={data?.page.bannerCopy}
      />

      <section className="resource-filter">
        <div className="container">
          <FinancialResourceFilter
            education={data?.education}
            funding={data?.funding}
            activeTags={activeTags}
            setActiveTags={setActiveTags}
          />

          <div className="content">
            <div className="heading">
              <h3>
                showing {getFilteredResources()?.length} out of {data?.resources.items.length}
              </h3>
            </div>
            {getFilteredResources()?.map((resource) => (
              <FinancialResource key={resource.sys?.id} {...resource} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};
