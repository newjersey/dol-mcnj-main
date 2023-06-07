export const HOMEPAGE_QUERY = `{
  homePage(id: "5hkY1ZOF5AgFW18UpzJRn1") {
    title
    pageDescription
    bannerButtonCopy
    bannerImage {
      url
      height
      width
    }
    toolsCollection(limit: 15) {
      items {
        sys {
          id
        }
        icon
        copy
        url
        description
      }
    }
    jobSearchToolLinksCollection(limit: 15) {
      items {
        sys {
          id
        }
        icon
        copy
        url
        description
      }
    }
    trainingToolLinksCollection(limit: 15) {
      items {
        sys {
          id
        }
        icon
        copy
        url
        description
      }
    }
    careerExplorationToolLinksCollection(limit: 15) {
      items {
        sys {
          id
        }
        icon
        copy
        url
        description
      }
    }
    supportAndAssistanceLinksCollection(limit: 15) {
      items {
        sys {
          id
        }
        icon
        copy
        url
        description
      }
    }
  }
}`;
