import { Heading } from "@components/modules/Heading";
import globalOgImage from "@images/globalOgImage.jpeg";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { PRIVACY_POLICY_PAGE_DATA as pageData } from "@data/pages/privacy-policy";

export function metadata() {
  return {
    title: pageData.seo.title,
    description: pageData.seo.pageDescription,
    openGraph: {
      images: [globalOgImage.src],
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function TermsOfServicePage() {
  return (
    <div
      className="container"
      style={{
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
    >
      <Heading {...pageData.heading} />
      <div className="row mbm mrkdwn">
        <div
          className="col-sm-12"
          dangerouslySetInnerHTML={{
            __html: parseMarkdownToHTML(pageData.copy),
          }}
        />
      </div>
    </div>
  );
}
