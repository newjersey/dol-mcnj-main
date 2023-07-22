import { fragments } from "./fragments";

export const ALL_SUPPORT_PAGE_QUERY = `query AllSupport {
  page: allSupportPage(id: "5q3sZR3WinrIUq7uWw2rdG") {
    title
    pageBanner {
      ...PageBanner
    }
    footerCtaHeading
    footerCtaLink {
      copy
      screenReaderOnlyCopy
      url
    }
  }
  categories: resourceCategoryCollection(limit: 30, where: {title_not: "Audience"}, order: title_ASC) {
    items {
      sys {
        id
      }
      title
      slug
      description
    }
  }
}
${fragments.pageBanner}
`;
