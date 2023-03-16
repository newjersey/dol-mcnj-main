import { gql } from "graphql-request";

export const TRAINING_PROVIDER_PAGE_QUERY = gql`
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
