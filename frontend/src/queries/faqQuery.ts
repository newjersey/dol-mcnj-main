import { gql } from "graphql-request";

export const FAQ_PAGE_QUERY = gql`
  {
    faqTopicCollection {
      items {
        topic
        itemsCollection {
          items {
            question
            answer {
              json
            }
          }
        }
      }
    }
  }
`;
