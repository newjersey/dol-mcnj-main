import { fragments } from "./fragments";

export const CAREER_NAVIGATOR_QUERY = `query CareerNavigator {
  page: careerNavigatorPage(id: "1jPbENKfUfAUhsh6ZWxjz8") {
    title
    pageBanner {
      ...PageBanner
    }
    opportunityCardsCollection(limit: 4) {
      items {
        ...LinkObject
      }
    }
    stepsHeading
    stepsCollection(limit: 3) {
      items {
        ...IconCard
      }
    }
    midPageCtaHeading
    midPageCtaLinksCollection(limit: 2) {
      items {
        ...LinkObject
      }
    }
    interrupterHeading
    interrupterLinksCollection(limit: 4) {
      items {
        ...LinkObject
      }
    }
    infoHeading
    infoCardsCollection(limit: 3) {
      items {
        ...IconCard
      }
    }
    riverItemsCollection(limit: 4) {
      items {
        image {
          url
          height
          width
        }
        heading
        copy
      }
    }
    footerCtaHeading
    footerCtaLink {
      ...LinkObject
    }
  }
}
${fragments.pageBanner}
${fragments.linkObject}
${fragments.iconCard}
`;
