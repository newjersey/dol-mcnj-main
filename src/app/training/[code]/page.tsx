import { notFound } from "next/navigation";
import { Content } from "./Content";
import { MainLayout } from "@components/global/MainLayout";
import { TrainingProps } from "@utils/types";
import { getNav } from "@utils/getNav";

async function getData(soc: string) {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();

  const pageData = await fetch(
    `${process.env.REACT_APP_API_URL}/api/trainings/${soc}`,
  );

  if (pageData.status !== 200) {
    notFound();
  }

  return {
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
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
  const { footerNav1, footerNav2, mainNav, globalNav, pageData } =
    await getData(params.code);

  if (pageData.status !== 200) {
    notFound();
  }

  const training: TrainingProps = await pageData.json();

  const navs = {
    footerNav1,
    footerNav2,
    mainNav,
    globalNav,
  };

  return (
    <MainLayout {...navs}>
      <div className="page trainingPage">
        <Content training={training} />
      </div>
    </MainLayout>
  );
}
