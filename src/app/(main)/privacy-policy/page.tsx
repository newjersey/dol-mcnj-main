import { Heading } from "@components/modules/Heading";
import globalOgImage from "@images/globalOgImage.jpeg";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { PRIVACY_POLICY_PAGE_DATA as pageData } from "@data/pages/privacy-policy";
import { SupportedLanguages } from "@utils/types/types";

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

export async function PrivacyPolicyPage({
  lang = "en",
}: {
  lang?: SupportedLanguages;
}) {
  return (
    <div
      className="container"
      style={{
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
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

export default PrivacyPolicyPage;
