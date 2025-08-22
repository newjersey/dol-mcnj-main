"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAREER_PATHWAY_QUERY = void 0;
exports.CAREER_PATHWAY_QUERY = `query Maps($id: String!) {
  careerMap(id: $id) {
    title
    sys {
      id
    }
    learnMoreBoxes
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
