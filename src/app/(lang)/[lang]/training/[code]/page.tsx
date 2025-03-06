import globalOgImage from "@images/globalOgImage.jpeg";
import TrainingPage from "app/(main)/training/[code]/page";
import { SupportedLanguages } from "@utils/types/types";
import { TrainingProps } from "@utils/types";
import { notFound } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ code: string }>;
}) => {
  const resolvedParams = await params;
  const pageData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/trainings/${resolvedParams.code}`
  );

  const training: TrainingProps = await pageData.json();

  return {
    title: `${training.name} | Training | ${process.env.REACT_APP_SITE_NAME}`,
    icons: {
      icon: "/favicon.ico",
    },
    description: training.description,
  };
};

export default async function EsTrainingPage({
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

  return TrainingPage({ params: pageParams, lang: pageParams.lang });
}
