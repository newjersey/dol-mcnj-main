import { Metadata } from "next";
import { SiteWrapper } from "@components/global/SiteWrapper";
import { SupportedLanguages } from "@utils/types/types";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.REACT_APP_SITE_URL as string),
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: {
    lang?: SupportedLanguages;
  };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return <SiteWrapper lang={lang}>{children}</SiteWrapper>;
}
