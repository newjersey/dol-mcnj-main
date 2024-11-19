"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAREER_NAVIGATOR_QUERY = void 0;
const fragments_1 = require("./fragments");
exports.CAREER_NAVIGATOR_QUERY = `query CareerNavigator {
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
          description
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
${fragments_1.fragments.pageBanner}
${fragments_1.fragments.linkObject}
${fragments_1.fragments.iconCard}
`;
