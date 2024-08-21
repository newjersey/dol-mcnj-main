import { CtaBanner } from "@components/blocks/CtaBanner";
import { PageBanner } from "@components/blocks/PageBanner";
import { MainLayout } from "@components/global/MainLayout";
import { IconCard } from "@components/modules/IconCard";
import { client } from "@utils/client";
import { getNav } from "@utils/getNav";
import { SupportResourcesPageProps } from "@utils/types";
import { ALL_SUPPORT_PAGE_QUERY } from "queries/allSupportPage";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();

  const { page, categories } = await client({
    query: ALL_SUPPORT_PAGE_QUERY,
  });

  return {
    page,
    categories,
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
  };
}

export const revalidate = 86400;

export async function generateMetadata({}) {
  const { page } = (await getData()) as SupportResourcesPageProps;

  return {
    title: `${page.title} | ${process.env.REACT_APP_SITE_NAME}`,
    description: page.pageDescription,
    keywords: page.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function SupportResourcesPage() {
  const { page, categories, footerNav1, footerNav2, mainNav, globalNav } =
    (await getData()) as SupportResourcesPageProps;

  const navs = {
    footerNav1,
    footerNav2,
    mainNav,
    globalNav,
  };

  return (
    <MainLayout {...navs}>
      <div className="page supportResources">
        <PageBanner {...page.pageBanner} />
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
        <CtaBanner
          inlineButtons
          headingLevel={2}
          heading={page.footerCtaHeading}
          items={[page.footerCtaLink]}
        />
      </div>
    </MainLayout>
  );
}
