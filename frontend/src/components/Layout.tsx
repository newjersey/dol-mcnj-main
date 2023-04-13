import { ReactNode, useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NavMenuData } from "../types/contentful";
import { Client } from "../domain/Client";

interface LayoutProps {
  client: Client;
  children?: ReactNode;
  footerComponent?: ReactNode;
  noFooter?: boolean;
  theme?: "blue" | "purple" | "green" | "navy";
}
export const Layout = (props: LayoutProps) => {
  const [globalNav, setGlobalNav] = useState<NavMenuData>();
  const [mainNav, setMainNav] = useState<NavMenuData>();
  const [footerNav1, setFooterNav1] = useState<NavMenuData>();
  const [footerNav2, setFooterNav2] = useState<NavMenuData>();

  const { children, client, noFooter } = props;

  const headerProps = {
    mainNav,
    globalNav,
  };

  useEffect(() => {
    client?.getContentfulGNav("gnav", {
      onSuccess: (response: {
        data: {
          data: NavMenuData;
        };
      }) => {
        setGlobalNav(response?.data?.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
    client?.getContentfulMNav("mnav", {
      onSuccess: (response: {
        data: {
          data: NavMenuData;
        };
      }) => {
        setMainNav(response?.data?.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
    client?.getContentfulFootNav1("footNav", {
      onSuccess: (response: {
        data: {
          data: NavMenuData;
        };
      }) => {
        setFooterNav1(response?.data?.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
    client?.getContentfulFootNav2("footNav2", {
      onSuccess: (response: {
        data: {
          data: NavMenuData;
        };
      }) => {
        setFooterNav2(response?.data?.data);
      },
      onError: (e) => {
        console.log(`An error, maybe an error code: ${e}`);
      },
    });
  }, [client]);

  return (
    <>
      <Header {...headerProps} />
      <main className={`below-banners${props.theme ? ` ${props.theme}-theme` : ""}`} role="main">
        {children}
      </main>
      {props.footerComponent}
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
