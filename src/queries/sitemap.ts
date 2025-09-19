export const SITEMAP_QUERY = `{
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
