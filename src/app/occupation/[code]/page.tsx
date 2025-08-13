import { OccupationPageProps } from "@utils/types";
import { notFound } from "next/navigation";
import globalOgImage from "@images/globalOgImage.jpeg";
import {
  civilEngineering,
  webDevelopers,
  carpenters,
  webDesign,
} from "mockData";
import { Content } from "./Content";
import { Related } from "./Related";

async function getData(soc: string) {
  const pageData = await fetch(
    `/api/occupations/${soc}`
  );

  return {
    pageData,
  };
}

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  searchParams: Promise<{
    mockData: string;
  }>;
  params: Promise<{
    code: string;
  }>;
}) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const pageData = await fetch(
    `/api/occupations/${resolvedParams.code}`
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

export default async function OccupationPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{
    mockData: string;
  }>;
  params: Promise<{
    code: string;
  }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { pageData } = await getData(resolvedParams.code);

  if (pageData.status !== 200 && !resolvedSearchParams.mockData) {
    notFound();
  }

  const occupationData: OccupationPageProps = await pageData.json();

  const mockDataMap = {
    civilEngineering: civilEngineering,
    webDevelopers: webDevelopers,
    carpenters: carpenters,
    webDesign: webDesign,
  } as any;

  const occupation =
    (mockDataMap[resolvedSearchParams.mockData] as OccupationPageProps) ||
    occupationData;

  return (
    <div className="page occupationPage">
      <Content occupation={occupation} />
      <Related occupation={occupation} />
    </div>
  );
}
