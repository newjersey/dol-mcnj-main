const NavMenuFields = `
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
`;

export const FAQ_PAGE_QUERY = `
  {
    faqCollection(id: "2CV0DOWvRHwiQ821b2VseR") {
      title
      topicsCollection {
        items {
          sys {
            id
          }
          topic
          itemsCollection {
            items {
              sys {
                id
              }
              question
              answer {
                json
              }
            }
          }
        }
      }
      linkGroup {
        heading
        linksCollection {
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
`;

export const TRAINING_PROVIDER_PAGE_QUERY = `
  {
    tabContent(id: "7urTmhpBev7jt9zxEWU4UH") {
      title
      sys {
        publishedAt
      }
      tabsCollection {
        items {
          sys {
            id
          }
          heading
          copy {
            json
          }
        }
      }
    }
  }
`;

export const NAV_QUERY = (id: string) => `{
  navMenus(id: "${id}") {
    ${NavMenuFields}
  }
}`;
