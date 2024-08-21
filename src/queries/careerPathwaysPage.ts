// import { richText } from './commonQueries'
import { fragments, metadata } from "./commonQueries";

export const CAREER_PATHWAYS_PAGE_QUERY = `query Pathways {
	page: careerPathwaysPage(id: "2bNH2ey6qkohbjnllmwSzg") {
    ${metadata}
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
