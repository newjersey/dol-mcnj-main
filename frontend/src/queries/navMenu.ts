export const NAV_MENU_QUERY = `query Nav($id: String!) {
  navMenus(id: $id) {
    sys {
      id
    }
    title
    heading
    url
    topLevelItemsCollection(limit: 100) {
      items {
        sys {
          id
        }
        copy
        screenReaderOnlyCopy
        classes
        url
        subItemsCollection(limit: 100) {
          items {
            sys {
              id
            }
            copy
            url
          }
        }
      }
    }
  }
}`;
