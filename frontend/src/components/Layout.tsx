import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NavMenuData } from "../types/contentful";

interface LayoutProps {
  children?: ReactNode;
  footerNav1?: NavMenuData;
  footerNav2?: NavMenuData;
  globalNav?: NavMenuData;
  mainNav?: NavMenuData;
  noFooter?: boolean;
}
export const Layout = ({
  children,
  footerNav1,
  footerNav2,
  globalNav,
  mainNav,
  noFooter,
}: LayoutProps) => {
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
