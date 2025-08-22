"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TUITION_ASSISTANCE_PAGE_QUERY = void 0;
const fragments_1 = require("./fragments");
const seoQuery_1 = require("./seoQuery");
exports.TUITION_ASSISTANCE_PAGE_QUERY = `query TuitionAssistance {
  page: financialResourcePage(id: "4WDrIZ71LCksX9Q63rbIwq") {
    ${seoQuery_1.SEO_QUERY}
    sys {
      publishedAt
    }
    pageBanner {
      ...PageBanner
    }
    bannerHeading
    bannerCopy {
      json
    }
    bannerImage {
      url
      description
      height
      width
    }
    footerBannerTitle
    footerBannerCopy {
      json
    }
  }
  education: financialResourceCategoryCollection(where: {type: "education"}) {
    items {
      sys {
        id
      }
      type
      title
    }
  }
  funding: financialResourceCategoryCollection(where: {type: "funding"}) {
    items {
      sys {
        id
      }
      type
      title
    }
  }
  resources: financialResourceEntryCollection {
    items {
      sys {
        id
      }
      title
      details {
        json
      }
      link
      taggedCatsCollection {
        items {
          sys {
            id
          }
          title
          color
        }
      }
    }
  }
}
${fragments_1.fragments.pageBanner}
`;
