import { CtaBannerProps } from "@components/blocks/CtaBanner";
import { PageBannerProps } from "@utils/types";

export const FAQ_PAGE_DATA = {
  seo: {
    title: `Frequently Asked Questions | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription: "Frequently Asked Questions for My Career NJ.",
    keywords: [
      "FAQ",
      "Frequently Asked Questions",
      "New Jersey",
      "Career",
      "Training",
      "Job",
      "My Career NJ",
    ],
    ogImage: {
      sys: {
        id: "buiOl5KtlbWd2n75TzD61",
      },
      url: "https://images.ctfassets.net/jbdk7q9c827d/buiOl5KtlbWd2n75TzD61/8614058229c32e1d4cfe2bb035b7746c/0d4a1adf-de41-46a6-b45a-75015bf737b3.png",
      title: "My Career NJ Title Card",
      width: 2400,
      height: 1260,
      fileName: "0d4a1adf-de41-46a6-b45a-75015bf737b3.png",
      contentType: "image/png",
    },
  },
  banner: {
    message: "Get answers to all of your My Career NJ questions.",
    title: "Frequently Asked Questions",
    section: "support",
    theme: "blue",
    breadcrumbsCollection: {
      items: [
        {
          sys: {
            id: "50o1RGfZ173Cis7VEFlBDR",
          },
          copy: "Home",
          url: "/",
        },
      ],
    },
  } as PageBannerProps,
  ctaBanner: {
    fullColor: true,
    heading: "Check out some other useful resources and tools",
    headingLevel: 2,
    customLinks: [
      {
        iconPrefix: "Fire",
        link: "https://mycareer.nj.gov/in-demand-occupations",
        label: "In-Demand Occupation List",
        type: "link",
        highlight: "orange",
      },
      {
        iconPrefix: "GraduationCap",
        link: "/training",
        label: "NJ Training Explorer",
        type: "link",
        highlight: "green",
      },
      {
        iconPrefix: "Lifebuoy",
        link: "/support-resources/tuition-assistance",
        label: "Tuition Assistance Resources",
        type: "link",
        highlight: "purple",
      },
      {
        iconPrefix: "ChalkboardTeacher",
        link: "/training-provider-resources",
        label: "Training Provider Resources",
        type: "link",
        highlight: "blue",
      },
    ],
  } as CtaBannerProps,
  cta: {
    headingLevel: 3,
    heading: "Still have questions?",
    inlineButtons: true,
    items: [
      {
        copy: "Contact Us",
        url: "/contact",
      },
    ],
  } as CtaBannerProps,
};
