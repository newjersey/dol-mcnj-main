export const NAV_QUERY = `query GetNav($navId:String!) {
 navMenus(id: $navId) {
    heading
    url
    topLevelItemsCollection {
      items {
        sys {
          id
        }
        copy
        screenReaderOnlyCopy
        classes
        url
        subItemsCollection {
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
