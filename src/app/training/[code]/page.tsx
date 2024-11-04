import { notFound } from "next/navigation";
import { Content } from "./Content";
import { TrainingProps } from "@utils/types";

async function getData(soc: string) {
  const pageData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/trainings/${soc}`,
  );

  if (pageData.status !== 200) {
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
  params: { code: string };
}) => {
  const pageData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/trainings/${params.code}`,
  );

  if (pageData.status !== 200) {
    notFound();
  }

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
  params: { code: string };
}) {
  const { pageData } = await getData(params.code);

  if (pageData.status !== 200) {
    notFound();
  }

  const training: TrainingProps = await pageData.json();

  return (
    <div className="page trainingPage">
      <Content training={training} />
    </div>
  );
}
