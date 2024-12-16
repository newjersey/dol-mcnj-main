import { fragments } from "./commonQueries";

export const ALL_SUPPORT_PAGE_QUERY = `query AllSupport {
  categories: resourceCategoryCollection(limit: 30, where: {title_not: "Audience"}, order: title_ASC) {
    items {
      sys {
        id
      }
      title
      slug
      description
    }
  }
}`;
