import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Client } from "../domain/Client";
import { BackToTop } from "./modules/BackToTop";
import { SeoProps } from "../types/contentful";
import { Seo } from "./Seo";
import { useContentful } from "../utils/useContentful";
import { AlertBar } from "./AlertBar";

interface LayoutProps {
  client: Client;
  children?: ReactNode;
  footerComponent?: ReactNode;
  className?: string;
  noFooter?: boolean;
  noPad?: boolean;
  theme?: "explore" | "jobs" | "support" | "training";
  seo?: SeoProps;
}
export const Layout = (props: LayoutProps) => {
  const { children, noFooter } = props;

  const globalNav = useContentful({
    path: "/nav-menu/7ARTjtRYG7ctcjPd1nbCHr",
  });
  const mainNav = useContentful({
    path: `/nav-menu/${
      process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "true"
        ? "6z5HiOP5HqvJc07FURpT8Z"
        : "3jcP5Uz9OY7syy4zu9Viul"
    }`,
  });
  const footerNav1 = useContentful({
    path: "/nav-menu/6QDRPQOaswzG5gHPgqoOkS",
  });
  const footerNav2 = useContentful({
    path: "/nav-menu/3WHbfXiLFSBXRC24QCq8H6",
  });

  const headerProps = {
    mainNav,
    globalNav,
  };

  return (
    <>
      {process.env.REACT_APP_FEATURE_MAINTENANCE === "true" && (
        <AlertBar
          copy="We will perform routine maintenance Tuesday, March 12, 2024 from 12 am to 6 am EST. My Career NJ and its applications (Training Explorer and Career Navigator)
            will be temporarily inaccessible during this period. We apologize for any inconvenience."
          heading="Scheduled Maintenance"
          type="warning"
          alertId="maintenance"
          dismissible
        />
      )}
      {process.env.REACT_APP_FEATURE_BETA === "true" && (
        <AlertBar
          copy={process.env.REACT_APP_FEATURE_BETA_MESSAGE}
          type="info"
          className="beta-alert"
        />
      )}

      {props.seo && <Seo {...props.seo} />}
      <Header {...headerProps} />
      <main
        id="main"
        className={`${!props.noPad ? "below-banners" : ""}${
          props.theme ? ` ${props.theme}-theme` : ""
        }${props.className ? ` ${props.className}` : ""}`}
        role="main"
      >
        {children}
        {props.footerComponent}
        <BackToTop />
      </main>
      {!noFooter && (
        <Footer
          items={{
            footerNav1,
            footerNav2,
          }}
        />
      )}
    </>
  );
};
