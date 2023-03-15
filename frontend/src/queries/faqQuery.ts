import { gql } from "graphql-request";

export const FAQ_PAGE_QUERY = gql`
  {
    faqCollection(id: "2CV0DOWvRHwiQ821b2VseR") {
      title
      topicsCollection {
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
  }
`;
