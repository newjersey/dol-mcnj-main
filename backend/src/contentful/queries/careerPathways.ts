import { fragments } from "./fragments";
import { SEO_QUERY } from "./seoQuery";

export const CAREER_PATHWAYS_PAGE_QUERY = `query Pathways {
	page: careerPathwaysPage(id: "2bNH2ey6qkohbjnllmwSzg") {
    ${SEO_QUERY}
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
${fragments.pageBanner}
${fragments.iconCard}
${fragments.linkObject}
`;
