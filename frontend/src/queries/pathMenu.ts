export const PATH_MENU_QUERY = `query Maps($id: String!) {
  careerMap(id: $id) {
    title
    careerMapItemsCollection {
      items {
        sys {
          id
        }
        title
      }
    }
  }
}`;
