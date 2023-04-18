export const FAQ_PAGE_QUERY = `
  {
    faqCollection(id: "2CV0DOWvRHwiQ821b2VseR") {
      title
      topicsCollection {
        items {
          sys {
            id
          }
          topic
          itemsCollection {
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
      linkGroup {
        heading
        linksCollection {
          items {
            sys {
              id
            }
            copy
            url
          }
        }
      }
    }
  }
`;
