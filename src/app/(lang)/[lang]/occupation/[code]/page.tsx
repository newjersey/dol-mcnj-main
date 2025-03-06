import globalOgImage from "@images/globalOgImage.jpeg";
import OccupationPage from "app/(main)/occupation/[code]/page";
import { SupportedLanguages } from "@utils/types/types";
import { OccupationPageProps } from "@utils/types";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  searchParams: Promise<{
    mockData: string;
  }>;
  params: { code: string };
}) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const pageData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/occupations/${resolvedParams.code}`
  );

  if (pageData.status !== 200 && !resolvedSearchParams.mockData) {
    notFound();
  }

  const occupation: OccupationPageProps = await pageData.json();

  return {
    title: `${occupation.title} | Occupation | ${process.env.REACT_APP_SITE_NAME}`,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
    description: occupation.description,
  };
};

export default async function EsOccupationPage({
  searchParams,
  params,
}: {
  searchParams: {
    mockData: string;
  };
  params: {
    code: string;
    lang?: SupportedLanguages;
  };
}) {
  const pageParams = await params;

  return OccupationPage({ searchParams, params: pageParams });
}
