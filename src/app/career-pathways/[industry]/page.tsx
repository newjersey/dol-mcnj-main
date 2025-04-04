import { client } from "@utils/client";
import { IndustryProps } from "@utils/types";
import { INDUSTRY_QUERY } from "queries/industryQuery";
import { Content } from "./Content";
import { notFound } from "next/navigation";
import globalOgImage from "@images/globalOgImage.jpeg";
import { CAREER_PATHWAYS_PAGE_DATA as pageData } from "@data/pages/career-pathways";

async function getIndustryData(slug: string) {
  const industry = await client({
    query: INDUSTRY_QUERY,
    variables: {
      slug,
    },
  });

  return {
    ...industry,
  };
}

export const revalidate = 1800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>; // Adjust the type to expect a Promise
}) {
  const resolvedParams = await params; // Await the params before accessing them

  const { industryCollection } = (await getIndustryData(
    resolvedParams.industry
  )) as {
    industryCollection: {
      items: IndustryProps[];
    };
  };

  const thisIndustry = industryCollection.items[0];

  if (!thisIndustry) {
    return notFound();
  }

  return {
    title: `${thisIndustry.title} | ${pageData.seo.title} | ${process.env.REACT_APP_SITE_NAME}`,
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

export default async function PathwayPage({
  params,
}: {
  params: Promise<{ industry: string }>; // Adjust the type to expect a Promise
}) {
  const resolvedParams = await params; // Await the params before accessing them

  const { industryCollection } = (await getIndustryData(
    resolvedParams.industry
  )) as {
    industryCollection: {
      items: IndustryProps[];
    };
  };

  const thisIndustry = industryCollection.items[0];

  if (!thisIndustry) {
    return notFound();
  }

  return <Content thisIndustry={thisIndustry} />;
}
