export const SITEMAP_QUERY = `{
  pages: entryCollection(where: {contentfulMetadata: {tags: {id_contains_some: "page"}}}) {
    items {
      __typename
      sys {
        publishedAt
      }
    }
  }
  resourceCategories: resourceCategoryCollection {
    items {
      sys {
        publishedAt
      }
      slug
    }
  }
  industries: industryCollection {
    items {
      sys {
        publishedAt
      }
      slug
    }
  }
}`;
