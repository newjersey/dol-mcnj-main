import { HeadingLevel, PageBannerProps } from "@utils/types";

export const CONTACT_PAGE_DATA = {
  seo: {
    title: `Contact Us | ${process.env.REACT_APP_SITE_NAME}`,
  },
  banner: {
    title: "Contact Us",
    theme: "blue",
    breadcrumbsCollection: {
      items: [
        {
          url: "/",
          copy: "Home",
        },
      ],
    },
  } as PageBannerProps,
  copyBox: {
    heading: "Contact Information",
    headingLevel: 2 as HeadingLevel,
    copy: `**NJ Department of Labor and Workforce Development**<br />
    Center for Occupational Employment Information (COEI)<br />
    PO Box 057, 5th Floor, Trenton, New Jersey 08625-0057`,
  },
};
