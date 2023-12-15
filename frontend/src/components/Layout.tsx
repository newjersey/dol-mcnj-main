import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { NAV_MENU_QUERY } from "../queries/navMenu";
import { BackToTop } from "./modules/BackToTop";
import { SeoProps } from "../types/contentful";
import { Seo } from "./Seo";

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

  const globalNav = useContentfulClient({
    query: NAV_MENU_QUERY,
    variables: { id: "7ARTjtRYG7ctcjPd1nbCHr" },
  });
  const mainNav = useContentfulClient({
    query: NAV_MENU_QUERY,
    variables: { id: "6z5HiOP5HqvJc07FURpT8Z" },
  });
  const footerNav1 = useContentfulClient({
    query: NAV_MENU_QUERY,
    variables: { id: "6QDRPQOaswzG5gHPgqoOkS" },
  });
  const footerNav2 = useContentfulClient({
    query: NAV_MENU_QUERY,
    variables: { id: "3WHbfXiLFSBXRC24QCq8H6" },
  });

  const headerProps = {
    mainNav,
    globalNav,
  };

  return (
    <>
      {props.seo && <Seo {...props.seo} />}
      <Header {...headerProps} />
      <main
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
