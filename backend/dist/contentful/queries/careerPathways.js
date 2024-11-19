"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAREER_PATHWAYS_PAGE_QUERY = void 0;
const fragments_1 = require("./fragments");
const seoQuery_1 = require("./seoQuery");
exports.CAREER_PATHWAYS_PAGE_QUERY = `query Pathways {
	page: careerPathwaysPage(id: "2bNH2ey6qkohbjnllmwSzg") {
    ${seoQuery_1.SEO_QUERY}
    sys {
      publishedAt
    }
    pageBanner {
      ...PageBanner
    }
    stepsHeading
    stepsCollection(limit: 3) {
      items {
        ...IconCard
      }
    }
    exploreHeading
    exploreButtonsCollection(limit:4) {
      items {
        ...LinkObject
      }
    }
    industries: industriesCollection(limit: 5) {
      items {
        sys {
          id
        }
        title
        slug
      }
    }
  }
}
${fragments_1.fragments.pageBanner}
${fragments_1.fragments.iconCard}
${fragments_1.fragments.linkObject}
`;
