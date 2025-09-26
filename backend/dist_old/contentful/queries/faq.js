"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAQ_PAGE_QUERY = void 0;
const fragments_1 = require("./fragments");
const seoQuery_1 = require("./seoQuery");
exports.FAQ_PAGE_QUERY = `
  query FaqPage {
    page: faqPage(id: "22fMmVDetJRhCbRltoS68") {
      sys {
        publishedAt
      }
      ${seoQuery_1.SEO_QUERY}
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
          icon
          copy
          url
        }
      }
    }
  }
  ${fragments_1.fragments.pageBanner}
`;
