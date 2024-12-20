import globalOgImage from "@images/globalOgImage.jpeg";
import { PageBanner } from "@components/blocks/PageBanner";
import { ContactForm } from "./ContactForm";
import { Heading } from "@components/modules/Heading";
import { Flex } from "@components/utility/Flex";
import { Box } from "@components/utility/Box";
import { CONTACT_PAGE_DATA as pageData } from "@data/pages/contact";
import { parseMarkdownToHTML } from "@utils/parseMarkdownToHTML";

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
  return (
    <>
      <PageBanner {...pageData.banner} />
      <Flex className="container contact-page" columnBreak="lg">
        <Box radius={5} className="bg-base-cool address">
          <Heading level={pageData.copyBox.headingLevel}>
            {pageData.copyBox.heading}
          </Heading>
          <div
            dangerouslySetInnerHTML={{
              __html: parseMarkdownToHTML(pageData.copyBox.copy),
            }}
          />
        </Box>
        <ContactForm />
      </Flex>
    </>
  );
}
