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
      careerMaps: mapsCollection {
        items {
          title
          sys {
            id
          }
        }
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
            links {
              assets {
                block {
                  sys {
                    id
                  }
                  url
                  title
                  description
                  width
                  height
                  contentType
                }
              }
            }
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
        }
      }
    }
  }
}`;
