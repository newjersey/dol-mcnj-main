import { GlobalPageProps } from "@utils/types";
import { Header } from "./Header";
import { ReactNode } from "react";
import { Footer } from "./Footer";
import { SkipToMain } from "@components/modules/SkipToMain";
import { Alert } from "@components/modules/Alert";

interface MainLayoutProps extends GlobalPageProps {
  children: ReactNode;
}

export const MainLayout = ({
  globalNav,
  mainNav,
  children,
  footerNav1,
  footerNav2,
}: MainLayoutProps) => {
  return (
    <>
      {process.env.REACT_APP_FEATURE_MAINTENANCE === "true" && (
        <Alert
          copy="We will perform routine maintenance Tuesday, March 12, 2024 from 12 am to 6 am EST. My Career NJ and its applications (Training Explorer and Career Navigator)
            will be temporarily inaccessible during this period. We apologize for any inconvenience."
          heading="Scheduled Maintenance"
          type="warning"
          alertId="maintenance"
          dismissible
        />
      )}
      {process.env.REACT_APP_FEATURE_BETA === "true" && (
        <Alert
          copy={process.env.REACT_APP_FEATURE_BETA_MESSAGE as string}
          type="info"
          className="beta-alert"
        />
      )}
      <SkipToMain />
      <Header globalNav={globalNav} mainNav={mainNav} />
      <div id="main-content">{children}</div>
      <Footer
        items={{
          footerNav1,
          footerNav2,
        }}
      />
    </>
  );
};
