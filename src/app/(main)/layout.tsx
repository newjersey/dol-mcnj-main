import { Metadata } from "next";
import { SiteWrapper } from "@components/global/SiteWrapper";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.REACT_APP_SITE_URL as string),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteWrapper>{children}</SiteWrapper>;
}
