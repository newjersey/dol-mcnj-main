export const OCCUPATIONS_QUERY = `query Occupations {
  industryCollection(limit: 5) {
    items {
      slug
      mapsCollection(limit: 5) {
        items {
          pathwaysCollection(limit: 10) {
            items {
              occupationsCollection(limit: 20) {
                items {
                  title
                  sys {
                    id
                  }
                }
              }
            }
          }
        }
      }
      inDemandCollection {
        items {
          title
          idNumber
        }
      }
    }
  }
}`;
