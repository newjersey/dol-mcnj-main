import { CtaBanner } from "@components/blocks/CtaBanner";
import { PageBanner } from "@components/blocks/PageBanner";
import { IconCard } from "@components/modules/IconCard";
import { client } from "@utils/client";
import { SupportResourcesPageProps } from "@utils/types";
import { ALL_SUPPORT_PAGE_QUERY } from "queries/allSupportPage";
import globalOgImage from "@images/globalOgImage.jpeg";
import { SUPPORT_RESOURCES_PAGE_DATA as pageData } from "@data/pages/support-resources";

async function getData() {
  const { categories } = await client({
    query: ALL_SUPPORT_PAGE_QUERY,
  });

  return {
    categories,
  };
}

export const revalidate = 86400;

export async function generateMetadata({}) {
  return {
    title: `${pageData.seo.title} | ${process.env.REACT_APP_SITE_NAME}`,
    description: pageData.seo.pageDescription,
    keywords: pageData.seo.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function SupportResourcesPage() {
  const { categories } = (await getData()) as SupportResourcesPageProps;

  return (
    <div className="page supportResources">
      <PageBanner {...pageData.banner} />
      <section className="categories">
        <div className="container">
          <div className="inner">
            {categories.items.map((category) => (
              <IconCard
                key={category.sys?.id}
                copy={category.title}
                message={category.description}
                theme="navy"
                systemIcon="support"
                url={`/support-resources/${category.slug}`}
                {...category}
              />
            ))}
          </div>
        </div>
      </section>
      <CtaBanner {...pageData.cta} />
    </div>
  );
}
