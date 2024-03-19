import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { PageBanner } from "../components/PageBanner";
import { FaqCollection } from "../components/FaqCollection";
import { FaqPageData, LinkObjectProps, ThemeColors } from "../types/contentful";
import { Layout } from "../components/Layout";
import { CtaBanner } from "../components/CtaBanner";
import { usePageTitle } from "../utils/usePageTitle";
import { useContentful } from "../utils/useContentful";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const data: FaqPageData = useContentful({ path: "/faq" });

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

      return {
        ...link,
        highlight: theme as ThemeColors,
        iconPrefix: link.icon,
      };
    });
  };

  usePageTitle(`${data?.page?.title} | ${process.env.REACT_APP_SITE_NAME}`);

  const seoObject = {
    title: `${data?.page?.title} | ${process.env.REACT_APP_SITE_NAME}`,
    description: data?.page?.pageDescription,
    image: data?.page?.ogImage?.url,
    keywords: data?.page?.keywords,
    url: props.location?.pathname,
  };

  return (
    <Layout client={props.client} theme="support" seo={seoObject}>
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
                url: "/contact",
              },
            ]}
          />
        </>
      )}
    </Layout>
  );
};
