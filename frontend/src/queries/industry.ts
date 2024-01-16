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
        items {
          sys {
            id
          }
          title
          idNumber
          numberOfJobs
        }
      }
      occupationsCollection {
        items {
          sys {
            id
          }
          title
          shortTitle
          inDemand
          numberOfAvailableJobs
          medianSalary
          salaryRangeStart
          salaryRangeEnd
          description
          educationLevel
          trainingSearchTerms
          tasks
          howToGetStarted
          howToGetHere
          education
          experience
          skills
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
    }
  }
}`;
