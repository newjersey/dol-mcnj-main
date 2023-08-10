import { fragments } from "./fragments";

export const CAREER_NAVIGATOR_QUERY = `query CareerNavigator {
  page: careerNavigatorPage(id: "1jPbENKfUfAUhsh6ZWxjz8") {
    title
    pageBanner {
      ...PageBanner
    }
    opportunitiesHeading
    opportunityCards: opportunityCardsCollection(limit: 4) {
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
    midPageCtaLinks: midPageCtaLinksCollection(limit: 2) {
      items {
        ...LinkObject
      }
    }
    interrupterHeading
    interrupterLinks: interrupterLinksCollection(limit: 4) {
      items {
        ...LinkObject
      }
    }
    infoHeading
    infoCards: infoCardsCollection(limit: 3) {
      items {
        ...IconCard
      }
    }
    river: riverItemsCollection(limit: 4) {
      items {
        sys {
          id
        }
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
