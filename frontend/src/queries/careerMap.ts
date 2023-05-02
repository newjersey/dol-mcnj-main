export const CAREER_MAP_QUERY = `query Maps($id: String!) {
  careerMap(id: $id) {
    title
    careerMapItemsCollection {
      items {
        sys {
          id
        }
        title
        shortTitle
        description
        salaryRangeStart
        salaryRangeEnd
        educationLevel
        extendsTo {
          sys {
            id
          }
        }
        nextItem: nextLevelItemsCollection(limit: 20) {
          items {
            sys {
              id
            }
            title
            shortTitle
            description
            salaryRangeEnd
            salaryRangeStart
            extendsTo {
              sys {
                id
              }
            }
          }
        }
      }
    }
  }
}`;
