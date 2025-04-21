import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Client } from "../domain/Client";
import { BackToTop } from "./modules/BackToTop";
import { SeoProps } from "../types/contentful";
import { Seo } from "./Seo";
import { useContentful } from "../utils/useContentful";
import { AlertBar } from "./AlertBar";
import { defaultKeywords } from "../utils/defaultKeywords";

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

  const defaultSeo = {
    title: process.env.REACT_APP_SITE_NAME as string,
    keywords: defaultKeywords,
    pageDescription:
      "Explore My Career NJ to find job training, career resources, and employment opportunities with the New Jersey Department of Labor.",
    image: "https://mycareer.nj.gov/thumbnail.png",
    url: "/",
  } as SeoProps;

  // if there are missing fields in props.seo then fill it in with defaultSeo
  if (props.seo) {
    (Object.keys(defaultSeo) as (keyof SeoProps)[]).forEach((key) => {
      if (props.seo![key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (props.seo as any)[key] = defaultSeo[key];
      }
    });
  }

  return (
    <>
      {process.env.REACT_APP_FEATURE_MAINTENANCE === "true" && (
        <AlertBar
          copy="We will perform routine maintenance Tuesday, March 12, 2024 from 12 am to 6 am EST. My Career NJ and its applications (Training Explorer and Career Navigator)
            will be temporarily inaccessible during this period. We apologize for any inconvenience."
          heading="Scheduled Maintenance"
          type="warning"
          alertId="maintenance"
          className="maintenance-alert"
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

      {props.seo ? <Seo {...props.seo} /> : <Seo {...defaultSeo} />}
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
