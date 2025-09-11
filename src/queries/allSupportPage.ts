export const ALL_SUPPORT_PAGE_QUERY = `query AllSupport {
  resources: resourceItemCollection{
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
            sys {
              id
            }
            title
            slug
          }
        }
      }
    }
  }
  categories: resourceCategoryCollection(
    limit: 10
    order: title_ASC
  ) {
    items {
      sys {
        id
      }
      title
      slug
    }
  }
  tags: resourceTagCollection(
    limit: 100
    order: title_ASC
  ) {
    items {
      sys {
        id
      }
      title
      category {
        sys {
          id
        }
        title
        slug
      }
    }
  }
}`;
