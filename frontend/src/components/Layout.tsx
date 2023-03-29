import { ReactNode } from "react";
import { Header } from "./Header";
import { BetaBanner } from "./BetaBanner";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  noFooter?: boolean;
}
export const Layout = ({ children, noFooter }: LayoutProps) => {
  return (
    <>
      <BetaBanner />
      <Header />
      <main className="below-banners" role="main">
        {children}
      </main>
      {!noFooter && <Footer />}
    </>
  );
};
