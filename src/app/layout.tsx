import "@styles/main.scss";
import { BackToTop } from "@components/modules/BackToTop";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.REACT_APP_SITE_URL as string),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Script src="https://newjersey.github.io/njwds/dist/js/uswds.min.js" />
        <main>{children}</main>
        <BackToTop />
      </body>
    </html>
  );
}
