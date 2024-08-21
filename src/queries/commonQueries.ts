export const richText = `json
links {
  assets {
    block {
      sys {
        id
      }
      url
      title
      description
      width
      height
      contentType
    }
  }
}`;

export const navItems = `footerNav1: navMenus(id: "6QDRPQOaswzG5gHPgqoOkS") {
  navItems
}
footerNav2: navMenus(id: "3WHbfXiLFSBXRC24QCq8H6") {
  navItems
}
globalNav: navMenus(id: "7ARTjtRYG7ctcjPd1nbCHr") {
  navItems
}
mainNav: navMenus(id: ${
  process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "true"
    ? '"6z5HiOP5HqvJc07FURpT8Z"'
    : '"3jcP5Uz9OY7syy4zu9Viul"'
}) {
  navItems
}`;

export const metadata = `
title
pageDescription
keywords
ogImage {
  sys {
    id
  }
  url
  title
  width
  height
  fileName
  contentType
}
`;

export const fragments = {
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
