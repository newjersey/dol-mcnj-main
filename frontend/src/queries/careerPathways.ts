import { fragments } from "./fragments";

export const CAREER_PATHWAYS_PAGE_QUERY = `query Pathways {
	page: careerPathwaysPage(id: "2bNH2ey6qkohbjnllmwSzg") {
    sys {
      publishedAt
    }
    title
    pageBanner {
      ...PageBanner
    }
    footerCtaHeading
    footerCtaLink {
      copy
      url
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
`;
