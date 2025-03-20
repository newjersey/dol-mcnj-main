import globalOgImage from "@images/globalOgImage.jpeg";
import { PageBanner } from "@components/blocks/PageBanner";
import { ContactForm } from "./ContactForm";
import { Heading } from "@components/modules/Heading";
import { Flex } from "@components/utility/Flex";
import { Box } from "@components/utility/Box";
import { CONTACT_PAGE_DATA as pageData } from "@data/pages/contact";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";
import { SupportedLanguages } from "@utils/types/types";
import { cookies } from "next/headers";

export const revalidate = 86400;

export async function generateMetadata({}) {
  return {
    title: pageData.seo.title,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      images: [globalOgImage.src],
    },
  };
}

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as SupportedLanguages) || "en";

  return (
    <>
      <PageBanner {...pageData[lang].banner} />
      <Flex className="container contact-page" columnBreak="lg">
        <Box radius={5} className="bg-base-cool address">
          <Heading level={pageData[lang].copyBox.headingLevel}>
            {pageData[lang].copyBox.heading}
          </Heading>
          <div
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(pageData[lang].copyBox.copy),
            }}
          />
        </Box>
        <ContactForm />
      </Flex>
    </>
  );
}
