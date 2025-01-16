import "@styles/main.scss";
import { BackToTop } from "@components/modules/BackToTop";
import { Metadata } from "next";
import Script from "next/script";
import { SkipToMain } from "@components/modules/SkipToMain";
import { Header } from "@components/global/Header";
import { Footer } from "@components/global/Footer";
import { Alert } from "@components/modules/Alert";
import { Public_Sans } from "next/font/google";
import {
  FOOTER_NAV_1_DATA as footerNav1,
  FOOTER_NAV_2_DATA as footerNav2,
} from "@data/global/navigation/footer";
import { MAIN_NAV_DATA as mainNav } from "@data/global/navigation/main";
import { GLOBAL_NAV_DATA as globalNav } from "@data/global/navigation/global";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.REACT_APP_SITE_URL as string),
};

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={publicSans.className}>
        <Script src="https://newjersey.github.io/njwds/dist/js/uswds.min.js" />
        <main>
          {process.env.REACT_APP_FEATURE_MAINTENANCE === "true" && (
            <Alert
              copy="We will perform routine maintenance Tuesday, March 12, 2024 from 12 am to 6 am EST. My Career NJ and its applications (Training Explorer and Career Navigator)
            will be temporarily inaccessible during this period. We apologize for any inconvenience."
              heading="Scheduled Maintenance"
              type="warning"
              alertId="maintenance"
              dismissible
            />
          )}
          {process.env.REACT_APP_FEATURE_BETA === "true" && (
            <Alert
              copy={process.env.REACT_APP_FEATURE_BETA_MESSAGE as string}
              type="info"
              className="beta-alert"
            />
          )}
          <SkipToMain />
          <Header globalNav={globalNav} mainNav={mainNav} />
          <div id="main-content">{children}</div>
          <Footer
            items={{
              footerNav1,
              footerNav2,
            }}
          />
        </main>
        <BackToTop />
      </body>
    </html>
  );
}
