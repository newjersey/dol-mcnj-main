import { MainLayout } from "@components/global/MainLayout";
import globalOgImage from "@images/globalOgImage.jpeg";
import { getSearchData } from "./utils/getSearchData";
import { Results } from "./components/Results";
import { getNav } from "@utils/getNav";

export const revalidate = 86400;

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string;
  };
}) => {
  return {
    title: `${
      searchParams.q ? `Results for "${searchParams.q}" | ` : ""
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
  searchParams: {
    [key: string]: string;
  };
}) {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();
  const searchProps = await getSearchData(props);

  const {
    pageData = [],
    searchParams,
    itemCount,
    pageNumber,
    totalPages,
  } = searchProps;
  const navs = {
    footerNav1,
    footerNav2,
    mainNav,
    globalNav,
  };
  return (
    <MainLayout {...navs}>
      <div className="search default">
        <div className="container">
          <Results
            items={pageData}
            searchParams={searchParams}
            count={itemCount}
            page={pageNumber}
            totalPages={totalPages}
          />
        </div>
      </div>
    </MainLayout>
  );
}
