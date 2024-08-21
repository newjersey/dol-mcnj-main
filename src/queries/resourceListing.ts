export const RESOURCE_LISTING_QUERY = `query ResourceListing($tags: [String!]) {
  resources: resourceItemCollection(where: {tags: {title_in: $tags}}) {
    items {
      sys {
        id
      }
      title
      description
      link
      tagsCollection(limit: 20) {
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
