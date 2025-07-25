import { ReactElement } from "react";
import { RouteComponentProps } from "@reach/router";
import { Client } from "../domain/Client";
import { FaqCollection } from "../components/FaqCollection";
import { FaqPageData, LinkObjectProps, ThemeColors } from "../types/contentful";
import { Layout } from "../components/Layout";
import { CtaBanner } from "../components/CtaBanner";
import { useContentful } from "../utils/useContentful";
import pageImage from "../images/ogImages/faq.jpg";
import { HeroBanner } from "../components/HeroBanner";
import { useTranslation } from "react-i18next";

interface Props extends RouteComponentProps {
  client: Client;
  id?: string;
}

export const FaqPage = (props: Props): ReactElement<Props> => {
  const data: FaqPageData = useContentful({ path: "/faq" });
  const { t } = useTranslation();

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

  const seoObject = {
    title: data
      ? `${data?.page?.title} | ${process.env.REACT_APP_SITE_NAME}`
      : `Frequently Asked Questions | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      data?.page?.pageDescription || "Get answers to all of your My Career NJ questions",
    image: data?.page?.ogImage?.url || pageImage,
    keywords: data?.page?.keywords || [
      "FAQ",
      "Frequently Asked Questions",
      "New Jersey",
      "Career",
      "Training",
      "Job",
      "My Career NJ",
    ],
    url: props.location?.pathname || "/faq",
  };

  return (
    <Layout client={props.client} theme="support" seo={seoObject}>
      {data && (
        <>
          <HeroBanner eyebrow={t("FaqPage.eyebrow")} heading={t("FaqPage.header")} />
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
