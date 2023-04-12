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
    page: faqPage(id: "22fMmVDetJRhCbRltoS68") {
      title
      bannerHeading
      bannerImage {
        url
      }
      topics: questionTopicsCollection {
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
      resourceLinkHeading
      resourceLinks: resourceLinksCollection {
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

export const FINANCIAL_RESOURCES_PAGE_QUERY = `{
  page: financialResourcePage(id: "4WDrIZ71LCksX9Q63rbIwq") {
    title
    bannerHeading
    bannerCopy {
      json
    }
    bannerImage {
      url
    }
    footerBannerTitle
    footerBannerCopy {
      json
    }
  }
  education: financialResourceCategoryCollection(where: {type: "education"}) {
    items {
      sys {
        id
      }
      type
      title
    }
  }
  funding: financialResourceCategoryCollection(where: {type: "funding"}) {
    items {
      sys {
        id
      }
      type
      title
    }
  }
  resources: financialResourceEntryCollection {
    items {
      sys {
        id
      }
      title
      details {
        json
      }
      link
      taggedCatsCollection {
        items {
          sys {
            id
          }
          title
          color
        }
      }
    }
  }
}`;

export const NAV_QUERY = (id: string) => `{
  navMenus(id: "${id}") {
    ${NavMenuFields}
  }
}`;
