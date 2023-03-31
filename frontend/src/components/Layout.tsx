import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NavMenuProps } from "../types/contentful";
import { useContentfulClient } from "../utils/useContentfulClient";
import { NAV_QUERY } from "../queries/navQuery";

interface LayoutProps {
  children: ReactNode;
  noFooter?: boolean;
}
export const Layout = ({ children, noFooter }: LayoutProps) => {
  const mainNav: NavMenuProps = useContentfulClient({
    query: NAV_QUERY,
    variables: { navId: "3z2JQqwp9gcolHLILD57PY" },
  });
  const globalNav: NavMenuProps = useContentfulClient({
    query: NAV_QUERY,
    variables: { navId: "7ARTjtRYG7ctcjPd1nbCHr" },
  });
  const footerNav1: NavMenuProps = useContentfulClient({
    query: NAV_QUERY,
    variables: { navId: "voDscWxEvggHqcXPzUtpR" },
  });
  const footerNav2: NavMenuProps = useContentfulClient({
    query: NAV_QUERY,
    variables: { navId: "3WHbfXiLFSBXRC24QCq8H6" },
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
