export const TRAINING_PROVIDER_PAGE_QUERY = `
  {
    tabContent(id: "7urTmhpBev7jt9zxEWU4UH") {
      title
      sys {
        publishedAt
      }
      tabsCollection {
        items {
          sys {
            id
          }
          heading
          copy {
            json
          }
        }
      }
    }
  }
`;
