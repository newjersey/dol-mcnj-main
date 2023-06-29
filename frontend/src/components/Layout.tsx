import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Client } from "../domain/Client";
import { useContentfulClient } from "../utils/useContentfulClient";
import { NAV_MENU_QUERY } from "../queries/navMenu";

interface LayoutProps {
  client: Client;
  children?: ReactNode;
  footerComponent?: ReactNode;
  noFooter?: boolean;
  theme?: "explore" | "jobs" | "support" | "training";
}
export const Layout = (props: LayoutProps) => {
  const { children, noFooter } = props;

  const globalNav = useContentfulClient({
    query: NAV_MENU_QUERY,
    variables: { id: "7ARTjtRYG7ctcjPd1nbCHr" },
  });
  const mainNav = useContentfulClient({
    query: NAV_MENU_QUERY,
    variables: { id: "3z2JQqwp9gcolHLILD57PY" },
  });
  const footerNav1 = useContentfulClient({
    query: NAV_MENU_QUERY,
    variables: { id: "voDscWxEvggHqcXPzUtpR" },
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
      <Header {...headerProps} />
      <main className={`below-banners${props.theme ? ` ${props.theme}-theme` : ""}`} role="main">
        {children}
        {props.footerComponent}
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
