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
    `${process.env.REACT_APP_API_URL}/api/occupations/${soc}`
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
    `${process.env.REACT_APP_API_URL}/api/occupations/${resolvedParams.code}`
  );

  if (pageData.status !== 200 && !resolvedSearchParams.mockData) {
    notFound();
  }

  let occupation: OccupationPageProps;
  try {
    const text = await pageData.text();
    if (!text.trim()) {
      if (!resolvedSearchParams.mockData) {
        notFound();
      }
      // Use a default if we have mock data but no API response
      occupation = { title: "Default Title", description: "Default Description" } as OccupationPageProps;
    } else {
      const parsed = JSON.parse(text);
      // If the API returned an error object, treat it as not found
      if (parsed.error) {
        if (!resolvedSearchParams.mockData) {
          notFound();
        }
        occupation = { title: "Default Title", description: "Default Description" } as OccupationPageProps;
      } else {
        occupation = parsed;
      }
    }
  } catch (error) {
    console.error("Error parsing occupation data:", error);
    if (!resolvedSearchParams.mockData) {
      notFound();
    }
    // Use a default if we have mock data but API parsing fails
    occupation = { title: "Default Title", description: "Default Description" } as OccupationPageProps;
  }

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

  let occupationData: OccupationPageProps | null = null;
  
  if (pageData.status === 200) {
    try {
      const text = await pageData.text();
      if (text.trim()) {
        const parsed = JSON.parse(text);
        // If the API returned an error object, don't use it
        if (!parsed.error) {
          occupationData = parsed;
        }
      }
    } catch (error) {
      console.error("Error parsing occupation data:", error);
      if (!resolvedSearchParams.mockData) {
        notFound();
      }
    }
  }

  const mockDataMap = {
    civilEngineering: civilEngineering,
    webDevelopers: webDevelopers,
    carpenters: carpenters,
    webDesign: webDesign,
  } as any;

  const occupation =
    (mockDataMap[resolvedSearchParams.mockData] as OccupationPageProps) ||
    occupationData;

  if (!occupation) {
    notFound();
  }

  return (
    <div className="page occupationPage">
      <Content occupation={occupation} />
      <Related occupation={occupation} />
    </div>
  );
}
