"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAREER_MAP_NODE_QUERY = void 0;
exports.CAREER_MAP_NODE_QUERY = `query MapNode($id:String!) {
  careerMapObject(id: $id) {
    sys {
      id
    }
    title
    shortTitle
    description
    salaryRangeEnd
    educationLevel
    salaryRangeStart
  }
}`;
