export const fragments = {
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
  linkObject: `fragment LinkObject on LinkObject{
    sys {
      id
    }
    copy
    screenReaderOnlyCopy
    url
    icon
    customSvg
    description
  }`,
  iconCard: `fragment IconCard on IconCard {
    sys {
      id
    }
    heading
    icon
    description
    sectionIcon
  }`,
};

export const NavMenuFields = `
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
