import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { GlobalHeaderProps } from "../types/contentful";
import { useContentfulClient } from "../utils/useContentfulClient";
import { NAV_QUERY } from "../queries/navQuery";

interface LayoutProps {
  children: ReactNode;
  noFooter?: boolean;
}
export const Layout = ({ children, noFooter }: LayoutProps) => {
  const mainNav: GlobalHeaderProps = useContentfulClient({
    query: NAV_QUERY,
    variables: { navId: "3z2JQqwp9gcolHLILD57PY" },
  });
  const globalNav: GlobalHeaderProps = useContentfulClient({
    query: NAV_QUERY,
    variables: { navId: "7ARTjtRYG7ctcjPd1nbCHr" },
  });

  const headerProps = {
    mainNav,
    globalNav,
  };

  return (
    <>
      <Header {...headerProps} />
      <main className="below-banners" role="main">
        {children}
      </main>
      {!noFooter && <Footer />}
    </>
  );
};
