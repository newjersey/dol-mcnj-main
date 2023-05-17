export const PATH_MENU_QUERY = `query Maps($id: String!) {
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
