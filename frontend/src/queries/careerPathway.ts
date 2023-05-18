export const CAREER_PATHWAY_QUERY = `query Maps($id: String!) {
  careerMap(id: $id) {
    title
    sys {
      id
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
            shortTitle
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
