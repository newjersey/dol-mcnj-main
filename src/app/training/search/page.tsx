import globalOgImage from "@images/globalOgImage.jpeg";
import { getSearchData } from "./utils/getSearchData";
import { Results } from "./components/Results";
import { SEARCH_RESULTS_PAGE_DATA as contentData } from "@data/pages/training/search";
import { Breadcrumbs } from "@components/modules/Breadcrumbs";
export const revalidate = 0;

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) => {
  const resolvedSearchParams = await searchParams;

  return {
    title: `${
      resolvedSearchParams.q ? `Results for "${resolvedSearchParams.q}" | ` : ""
    }Search | ${process.env.REACT_APP_SITE_NAME}`,
    openGraph: {
      images: [globalOgImage.src],
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
};

export default async function SearchPage(props: {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) {
  const resolvedSearchParams = await props.searchParams;
  const searchProps = await getSearchData({
    searchParams: resolvedSearchParams,
  });

  const {
    pageData = [],
    searchParams,
    itemCount,
    pageNumber,
    totalPages,
  } = searchProps;

  return (
    <div className="search default">
      <div className="container">
        <Breadcrumbs {...contentData.breadcrumbs} />
        <Results
          items={pageData}
          searchParams={searchParams}
          count={itemCount}
          page={pageNumber}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
