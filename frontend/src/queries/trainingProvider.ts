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
    }
    tabs: tabsCollection {
      items {
        sys {
          id
        }
        heading
        copy {
          json
        }
      }
    }
  }
}
${fragments.pageBanner}
`;
