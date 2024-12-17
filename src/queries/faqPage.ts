export const FAQ_PAGE_QUERY = `
query FaqPage {
  page: faqPage(id: "22fMmVDetJRhCbRltoS68") {
    categoriesCollection(limit: 15) {
      items {
        sys {
          id
        }
        title
        topics: topicsCollection(limit: 5) {
          items {
            sys {
              id
            }
            topic
            itemsCollection(limit: 10) {
              items {
                sys {
                  id
                }
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
  }
}
`;
