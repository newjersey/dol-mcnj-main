export const NAV_QUERY = `query GetNav($navId:String!) {
 navMenus(id: $navId) {
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
