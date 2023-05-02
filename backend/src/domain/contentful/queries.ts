const fragments = {
  pageBanner: `fragment PageBanner on PageBanner {
    title
    section
    breadcrumbsCollection {
      items {
        sys {
          id
        }
        copy
        url
      }
    }
    message {
      json
    }
    ctaHeading
    ctaLinksCollection {
      items {
        sys {
          id
        }
        copy
        url
      }
    }
  }`,
};

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
  query FaqPage {
    page: faqPage(id: "22fMmVDetJRhCbRltoS68") {
      sys {
        publishedAt
      }
      title
      bannerHeading
      bannerImage {
        url
      }
      pageBanner {
        ...PageBanner
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
  ${fragments.pageBanner}
`;

export const TRAINING_PROVIDER_PAGE_QUERY = `
query TrainingProviderPage {
  page: trainingProviderResourcesPage(id: "4GrMLVPYkDCMzMLCxEgy9s") {
    sys {
      publishedAt
    }
    title
    pageBanner {
      ...PageBanner
    }
    bannerHeading
    bannerImage {
      url
    }
    tabs: tabsCollection {
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
${fragments.pageBanner}
`;

export const CAREER_PATHWAYS_PAGE_QUERY = `query Pathways {
	page: careerPathwaysPage(id: "2bNH2ey6qkohbjnllmwSzg") {
    sys {
      publishedAt
    }
    title
    pageBanner {
      ...PageBanner
    }
    footerCtaHeading
    footerCtaLink {
      copy
      url
    }
  }
  industries: industryCollection(limit: 20) {
    items {
      title
      slug
      shorthandTitle
      description {
        json
      }
      photo {
        url
      }
      sys{
        id
      }
      inDemandCollection {
				items {
          sys {
            id
          }
          title
          idNumber
          numberOfJobs
        }
      }
      industryAccordionCollection {
        items {
          sys {
            id
          }
          icon {
            url
          }
          title
          copy {
            json
          }
        }
      }
    }
  }
}
${fragments.pageBanner}
`;

export const TUITION_ASSISTANCE_PAGE_QUERY = `query TuitionAssistance {
  page: financialResourcePage(id: "4WDrIZ71LCksX9Q63rbIwq") {
    sys {
      publishedAt
    }
    title
    pageBanner {
      ...PageBanner
    }
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
}
${fragments.pageBanner}
`;

export const NAV_QUERY = (id: string) => `{
  navMenus(id: "${id}") {
    ${NavMenuFields}
  }
}`;
