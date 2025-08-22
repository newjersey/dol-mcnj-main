"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_SUPPORT_PAGE_QUERY = void 0;
const fragments_1 = require("./fragments");
const seoQuery_1 = require("./seoQuery");
exports.ALL_SUPPORT_PAGE_QUERY = `query AllSupport {
  page: allSupportPage(id: "5q3sZR3WinrIUq7uWw2rdG") {
    ${seoQuery_1.SEO_QUERY}
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
${fragments_1.fragments.pageBanner}
`;
