import { notFound } from "next/navigation";
import { Content } from "./Content";
import { TrainingProps } from "@utils/types";

async function getData(soc: string) {
  const pageData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/trainings/${soc}`
  );

  if (pageData.status !== 200 || !pageData.headers.get("ETag")) {
    notFound();
  }

  return {
    pageData,
  };
}

export const revalidate = 1800;

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

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = await params;
  const { pageData } = await getData(resolvedParams.code);

  const training: TrainingProps = await pageData.json();

  return (
    <div className="page trainingPage">
      <Content training={training} />
    </div>
  );
}
