"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESOURCE_LISTING_QUERY = exports.RESOURCE_CATEGORY_QUERY = void 0;
exports.RESOURCE_CATEGORY_QUERY = `query ResourceCategory($slug: String!) {
  page: resourceCategoryCollection(where: {slug: $slug}, limit: 1) {
    items {
      sys {
        id
      }
      title
      description
      slug
      infoBox
      related: relatedCategoriesCollection(limit: 5) {
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
exports.RESOURCE_LISTING_QUERY = `query ResourceListing($tags: [String!]) {
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
