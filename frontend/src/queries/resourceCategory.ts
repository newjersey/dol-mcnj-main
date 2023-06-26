export const RESOURCE_CATEGORY_QUERY = `query ResourceCategory($slug: String!) {
  page: resourceCategoryCollection(where: {slug: $slug}, limit: 1) {
    items {
      sys {
        id
      }
      title
      description
      slug
      infoBox
    }
  }
  tags: resourceTagCollection(where: {category: {slug: $slug}}) {
    items {
      sys {
        id
      }
      title
      category {
        title
        slug
      }
    }
  }
  audience: resourceTagCollection(where: {category: {slug: "audience"}}) {
    items {
      sys {
        id
      }
      title
      category {
        title
        slug
      }
    }
  }
  cta: allSupportPage(id: "5q3sZR3WinrIUq7uWw2rdG") {
    footerCtaHeading
    footerCtaLink {
      copy
      screenReaderOnlyCopy
      url
    }
  }
}`;

export const RESOURCE_LISTING_QUERY = `query ResourceListing($tags: [String!]) {
  resources: resourceItemCollection(where: {tags: {title_in: $tags}}) {
    items {
      sys {
        id
      }
      title
      description
      link
      tags: tagsCollection(limit: 20) {
        items {
          sys {
            id
          }
          title
          category {
            title
            slug
          }
        }
      }
    }
  }
}`;
