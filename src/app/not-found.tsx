import { GlobalPageProps } from "@utils/types";
import { SystemError } from "@components/modules/SystemError";
import { getNav } from "@utils/getNav";
import { MainLayout } from "@components/global/MainLayout";

async function getData() {
  const { globalNav, mainNav, footerNav1, footerNav2 } = await getNav();

  return {
    globalNav,
    mainNav,
    footerNav1,
    footerNav2,
  };
}

export const metadata = async () => {
  return {
    title: `404 Not Found | ${process.env.REACT_APP_SITE_NAME}`,
  };
};

export default async function RootLayout() {
  const { globalNav, mainNav, footerNav1, footerNav2 } =
    (await getData()) as GlobalPageProps;
  return (
    <MainLayout
      globalNav={globalNav}
      mainNav={mainNav}
      footerNav1={footerNav1}
      footerNav2={footerNav2}
    >
      <div className="container">
        <SystemError
          heading="Sorry, we can't seem to find that page"
          copy='<p>Try one of these instead:</p><ul><li><a href="/training/search">Search for a training opportunity</a></li><li><a href="https://www.careeronestop.org/" target="_blank" rel="noopener noreferrer">Look up your local One-Stop Career Center</a></li></ul>'
          color="green"
        />
      </div>
    </MainLayout>
  );
}
