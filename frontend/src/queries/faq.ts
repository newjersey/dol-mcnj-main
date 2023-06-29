import { fragments } from "./fragments";

export const FAQ_PAGE_QUERY = `
  query FaqPage {
    page: faqPage(id: "22fMmVDetJRhCbRltoS68") {
      sys {
        publishedAt
      }
      title
      bannerHeading
      bannerImage {
        url
      }
      pageBanner {
        ...PageBanner
      }
      topics: questionTopicsCollection {
        items {
          sys {
            id
          }
          topic
          itemsCollection {
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
