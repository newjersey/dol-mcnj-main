export const NEW_JERSEY_NAV_QUERY = `{
  navMenus(id:"7ARTjtRYG7ctcjPd1nbCHr") {
    topLevelItemsCollection {
      items {
        sys {
          id
        }
        copy
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
