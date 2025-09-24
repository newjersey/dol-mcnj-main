import "@styles/tailwind.scss";
import "@styles/main.scss";
import { BackToTop } from "@components/modules/BackToTop";
import Script from "next/script";
import { SkipToMain } from "@components/modules/SkipToMain";
import { Header } from "@components/global/Header";
import { Footer } from "@components/global/Footer";
import { Alert } from "@components/modules/Alert";
import { Public_Sans } from "next/font/google";
import { cookies } from "next/headers";
import {
  FOOTER_NAV_1_DATA as footerNav1,
  FOOTER_NAV_2_DATA as footerNav2,
} from "@data/global/navigation/footer";
import { MAIN_NAV_DATA as mainNav } from "@data/global/navigation/main";
import { GLOBAL_NAV_DATA as globalNav } from "@data/global/navigation/global";
import { SupportedLanguages } from "@utils/types/types";
import { Metadata } from "next";
import { LangSelector } from "@components/global/LangSelector";
import { SmartPageLoadTracker } from "@components/utils/SmartPageLoadTracker";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.REACT_APP_SITE_URL as string),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <html lang={lang || "en"}>
      <body className={publicSans.className}>
        <Script src="https://newjersey.github.io/njwds/dist/js/uswds.min.js" />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            window.allowedHosts = ['mycareer.nj.gov', 'test.mycareer.nj.gov', 'dev.mycareer.nj.gov'];
            window.hostname = document.location.hostname;

            if (window.allowedHosts.includes(window.hostname)) {
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KBN58VK9');
            }
          `}
        </Script>
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
          <SmartPageLoadTracker />
          <Header globalNav={globalNav} mainNav={mainNav} lang={lang} />
          {process.env.REACT_APP_FEATURE_MULTILANG === "true" && (
            <LangSelector />
          )}
          <div id="main-content">{children}</div>
          <Footer
            lang={lang}
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
