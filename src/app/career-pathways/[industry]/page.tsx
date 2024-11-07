import { client } from "@utils/client";
import { CareerPathwaysPageProps, IndustryProps } from "@utils/types";
import { CAREER_PATHWAYS_PAGE_QUERY } from "queries/careerPathwaysPage";
import { INDUSTRY_QUERY } from "queries/industryQuery";
import { Content } from "./Content";
import { notFound } from "next/navigation";
import globalOgImage from "@images/globalOgImage.jpeg";

async function getData() {
  const { page } = await client({
    query: CAREER_PATHWAYS_PAGE_QUERY,
  });

  if (process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "false" || !page) {
    return notFound();
  }

  return {
    page,
  };
}

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

export async function generateMetadata() {
  const { page } = (await getData()) as CareerPathwaysPageProps;

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

export default async function PathwayPage({
  params,
}: {
  params: {
    industry: string;
  };
}) {
  const { industryCollection } = (await getIndustryData(params.industry)) as {
    industryCollection: {
      items: IndustryProps[];
    };
  };

  const thisIndustry = industryCollection.items[0];

  if (
    process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "false" ||
    !thisIndustry
  ) {
    return notFound();
  }

  return (
    <div className="careerPathways">
      <Content thisIndustry={thisIndustry} />
    </div>
  );
}
