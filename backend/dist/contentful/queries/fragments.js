"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavMenuFields = exports.fragments = void 0;
exports.fragments = {
    pageBanner: `fragment PageBanner on PageBanner {
    title
    section
    breadcrumbsCollection(limit: 10) {
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
    ctaLinksCollection(limit: 2) {
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
exports.NavMenuFields = `
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
