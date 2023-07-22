import { fragments } from "./fragments";

export const TUITION_ASSISTANCE_PAGE_QUERY = `query TuitionAssistance {
  page: financialResourcePage(id: "4WDrIZ71LCksX9Q63rbIwq") {
    sys {
      publishedAt
    }
    title
    pageBanner {
      ...PageBanner
    }
    bannerHeading
    bannerCopy {
      json
    }
    bannerImage {
      url
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
${fragments.pageBanner}
`;
