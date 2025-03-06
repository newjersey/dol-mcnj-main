import globalOgImage from "@images/globalOgImage.jpeg";
import ResourcesPage, {
  getData,
} from "app/(main)/support-resources/[slug]/page";
import { SupportedLanguages } from "@utils/types/types";
import { ResourceCategoryPageProps } from "@utils/types";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const data = (await getData(slug)) as ResourceCategoryPageProps;

  return {
    title: `${data.page.items[0].title} | Support Resources | ${process.env.REACT_APP_SITE_NAME}`,
    description: data.page.items[0].description,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
};

export default async function EsResourcesPage({
  params,
}: {
  params: {
    slug: string;
    lang?: SupportedLanguages;
  };
}) {
  const pageParams = await params;

  return ResourcesPage({ params: pageParams });
}
