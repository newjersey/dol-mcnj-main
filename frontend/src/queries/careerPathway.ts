export const CAREER_PATHWAY_QUERY = `query Maps($id: String!) {
  careerMap(id: $id) {
    title
    sys {
      id
    }
    careerPathwayItemsCollection {
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
      }
    }
    pathways: pathwaysCollection {
      items {
        sys {
          id
        }
        title
        occupationsCollection {
          items {
            sys {
              id
            }
            title
            level
            salaryRangeStart
            salaryRangeEnd
            educationLevel
          }
        }
      }
    }
  }
}`;
