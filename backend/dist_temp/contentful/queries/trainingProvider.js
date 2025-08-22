"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRAINING_PROVIDER_PAGE_QUERY = void 0;
const fragments_1 = require("./fragments");
const seoQuery_1 = require("./seoQuery");
exports.TRAINING_PROVIDER_PAGE_QUERY = `
query TrainingProviderPage {
  page: trainingProviderResourcesPage(id: "4GrMLVPYkDCMzMLCxEgy9s") {
    ${seoQuery_1.SEO_QUERY}
    sys {
      publishedAt
    }
    pageBanner {
      ...PageBanner
    }
    bannerHeading
    bannerImage {
      url
      description
      height
      width
    }
    tabs: tabsCollection(limit: 10) {
      items {
        sys {
          id
        }
        heading
        copy {
          json
          links {
            assets {
              block {
                sys {
                  id
                }
                url
                title
                description
                width
                height
                contentType
              }
            }
          }
        }
      }
    }
  }
}
${fragments_1.fragments.pageBanner}
`;
