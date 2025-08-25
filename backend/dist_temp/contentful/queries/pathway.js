"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATHWAY_QUERY = void 0;
exports.PATHWAY_QUERY = `query Pathway($id: String!) {
  pathway(id: $id) {
    title
    sys {
      id
    }
    occupationsCollection {
      items {
        sys {
          id
        }
        title
        level
        educationLevel
        salaryRangeStart
        salaryRangeEnd
      }
    }
  }
}`;
