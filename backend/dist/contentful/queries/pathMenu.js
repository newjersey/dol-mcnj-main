"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATH_MENU_QUERY = void 0;
exports.PATH_MENU_QUERY = `query Maps($id: String!) {
  careerMap(id: $id) {
    title
    careerPathwayItemsCollection {
      items {
        sys {
          id
        }
        title
      }
    }
  }
}`;
