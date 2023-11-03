import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { FaqCollection } from "../components/FaqCollection";
import { FaqPageData, LinkObjectProps, ThemeColors } from "../types/contentful";
import { Layout } from "../components/Layout";
import { useContentfulClient } from "../utils/useContentfulClient";
import { FAQ_PAGE_QUERY } from "../queries/faq";
import { CtaBanner } from "../components/CtaBanner";
import { IconNames } from "../types/icons";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const data: FaqPageData = useContentfulClient({ query: FAQ_PAGE_QUERY });

  const ctaLinkConverter = (links: LinkObjectProps[]) => {
    return links.map((link, index: number) => {
      const theme =
        index % 4 === 0
          ? "orange"
          : index % 4 === 1
          ? "green"
          : index % 4 === 2
          ? "purple"
          : "blue";

      const icon =
        index % 4 === 0
          ? "Fire"
          : index % 4 === 1
          ? "ChalkboardTeacher"
          : index % 4 === 2
          ? "MapTrifold"
          : "Briefcase";
      return {
        ...link,
        highlight: theme as ThemeColors,
        iconPrefix: icon as IconNames,
      };
    });
  };

  return (
    <Layout client={props.client} theme="support">
      {data && (
        <>
          <PageBanner {...data.page.pageBanner} date={data.page.sys.publishedAt} />
          <FaqCollection items={data?.page.categoriesCollection.items} />
          <CtaBanner
            heading={data?.page.resourceLinkHeading}
            headingLevel={2}
            theme="blue"
            fullColor
            noIndicator
            links={ctaLinkConverter(data?.page.resourceLinks.items)}
          />
          <CtaBanner
            heading="Still have questions?"
            headingLevel={3}
            inlineButtons
            theme="blue"
            links={[
              {
                sys: {
                  id: "contactUs",
                },
                copy: "Contact Us",
                url: "https://docs.google.com/forms/d/e/1FAIpQLScAP50OMhuAgb9Q44TMefw7y5p4dGoE_czQuwGq2Z9mKmVvVQ/formrestricted",
              },
            ]}
          />
        </>
      )}
    </Layout>
  );
};
