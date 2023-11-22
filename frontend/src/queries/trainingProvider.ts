import { fragments } from "./fragments";

export const TRAINING_PROVIDER_PAGE_QUERY = `
query TrainingProviderPage {
  page: trainingProviderResourcesPage(id: "4GrMLVPYkDCMzMLCxEgy9s") {
    sys {
      publishedAt
    }
    title
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
${fragments.pageBanner}
`;
