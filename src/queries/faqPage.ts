// import { richText } from './commonQueries'
import { fragments, metadata } from "./commonQueries";

export const FAQ_PAGE_QUERY = `
query FaqPage {
  page: faqPage(id: "22fMmVDetJRhCbRltoS68") {
    sys {
      publishedAt
    }
    ${metadata}
    bannerHeading
    bannerImage {
      url
    }
    pageBanner {
      ...PageBanner
    }
    categoriesCollection(limit: 15) {
      items {
        sys {
          id
        }
        title
        topics: topicsCollection(limit: 5) {
          items {
            sys {
              id
            }
            topic
            itemsCollection(limit: 10) {
              items {
                sys {
                  id
                }
                question
                answer {
                  json
                }
              }
            }
          }
        }
      }
    }
    resourceLinkHeading
    resourceLinks: resourceLinksCollection {
      items {
        sys {
          id
        }
        copy
        url
      }
    }
  }
}
${fragments.pageBanner}
`;
