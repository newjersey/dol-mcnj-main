export const INDUSTRY_QUERY = `query Industry($slug: String!) {
  industryCollection(where: {slug: $slug}, limit: 1) {
    items {
      sys {
        id
      }
      title
      shorthandTitle
      slug
      description {
        json
      }
      photo {
        url
        width
        height
      }
      inDemandCollection {
        items{
          sys {
            id
          }
          title
          idNumber
        }
      }
      industryAccordionCollection(limit: 3) {
        items {
          sys {
            id
          }
          title
          icon {
            height
            width
            url
          }
          copy {
            json
          }
        }
      }
      inDemandCollection {
        items {
          sys {
            id
          }
          title
          idNumber
          numberOfJobs
          hourlyRate
        }
      }
    }
  }
}`;
