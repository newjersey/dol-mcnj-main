import globalOgImage from "@images/globalOgImage.jpeg";
import { PageBanner } from "@components/blocks/PageBanner";
import { ContactForm } from "./ContactForm";
import { Heading } from "@components/modules/Heading";
import { Flex } from "@components/utility/Flex";
import { Box } from "@components/utility/Box";

export const revalidate = 86400;

export async function generateMetadata({}) {
  return {
    title: `Contact Us | ${process.env.REACT_APP_SITE_NAME}`,
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
      <PageBanner
        title="Contact Us"
        theme="blue"
        breadcrumbsCollection={{
          items: [
            {
              url: "/",
              copy: "Home",
            },
          ],
        }}
      />
      <Flex className="container contact-page" columnBreak="lg">
        <Box radius={5} className="bg-base-cool address">
          <Heading level={2}>Contact Information</Heading>
          <p>
            <strong>NJ Department of Labor and Workforce Development</strong>
            <br />
            Center for Occupational Employment Information (COEI)
            <br />
            PO Box 057, 5th Floor, Trenton, New Jersey 08625-0057
          </p>
        </Box>

        <ContactForm />
      </Flex>
    </>
  );
}
