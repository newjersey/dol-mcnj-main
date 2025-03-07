import { Heading } from "@components/modules/Heading";
import globalOgImage from "@images/globalOgImage.jpeg";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { SMS_USE_POLICY_PAGE_DATA as pageData } from "@data/pages/sms-use-policy";
import { SupportedLanguages } from "@utils/types/types";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: pageData.seo.title,
  description: pageData.seo.pageDescription,
  openGraph: {
    images: [globalOgImage.src],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function SmsUsePolicyPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <div
      className="container"
      style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
    >
      <Heading {...pageData[lang].heading} />
      <div className="row mbm mrkdwn">
        <div
          className="col-sm-12"
          dangerouslySetInnerHTML={{
            __html: parseMarkdownToHTML(pageData[lang].copy),
          }}
        />
      </div>
    </div>
  );
}
