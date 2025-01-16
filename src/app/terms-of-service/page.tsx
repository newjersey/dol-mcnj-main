import { Heading } from "@components/modules/Heading";
import globalOgImage from "@images/globalOgImage.jpeg";
import { TERMS_OF_SERVICE_PAGE_DATA as pageData } from "@data/pages/terms-of-service";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

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
      className="container "
      style={{
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
    >
      <Heading {...pageData.heading} />
      <div
        className="mrkdwn"
        dangerouslySetInnerHTML={{
          __html: parseMarkdownToHTML(pageData.copy),
        }}
      />
    </div>
  );
}
