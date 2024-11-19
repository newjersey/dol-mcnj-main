import { metadata, navItems } from "./commonQueries";

export const HOMEPAGE_QUERY = `{
  homePage(id: "5hkY1ZOF5AgFW18UpzJRn1") {
    ${metadata}
    bannerButtonCopy
    bannerImage {
      url
      description
      height
      width
    }
    toolsCollection(limit: 15) {
      items {
        sys {
          id
        }
        icon
        sectionIcon
        copy
        url
        description
      }
    }
    introBlocks
    jobSearchToolLinksCollection(limit: 15) {
      items {
        sys {
          id
        }
        sectionIcon
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
        sectionIcon
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
        sectionIcon
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
        sectionIcon
        copy
        url
        description
      }
    }
  }
}`;
