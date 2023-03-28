import { ReactNode } from "react";
import { Header } from "./Header";
import { BetaBanner } from "./BetaBanner";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}
export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <BetaBanner />
      <main className="below-banners" role="main">
        {children}
      </main>
      <Footer />
    </>
  );
};
