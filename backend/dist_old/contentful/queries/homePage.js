"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOMEPAGE_QUERY = void 0;
const seoQuery_1 = require("./seoQuery");
exports.HOMEPAGE_QUERY = `{
  homePage(id: "5hkY1ZOF5AgFW18UpzJRn1") {
    ${seoQuery_1.SEO_QUERY}
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
