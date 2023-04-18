import { Document } from "@contentful/rich-text-types";

export interface Keypair {
  key: string;
  value: string | Keypair | Keypair[];
}

export interface FaqItemTopic {
  topic: string;
  order: number;
}

export interface ContentfulRichText {
  json: Document;
}

export interface FaqItem {
  sys?: {
    id: string;
  };
  question: string;
  answer: ContentfulRichText;
  order: number;
  topic: FaqItemTopic;
}

export interface FaqTopic {
  sys?: {
    id: string;
  };
  topic: string;
  itemsCollection: {
    items: FaqItem[];
  };
}

export interface LinkObjectProps {
  sys?: {
    id: string;
  };
  copy?: string;
  url: string;
  screenReaderOnlyCopy?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
  icons?: boolean;
}

export interface LinkGroupProps {
  heading: string;
  linksCollection: {
    items: LinkObjectProps[];
  };
}

export interface FaqPageData {
  faqCollection: {
    title: string;
    topicsCollection: {
      items: FaqTopic[];
    };
    linkGroup: LinkGroupProps;
  };
}

export interface FaqPageProps {
  data: {
    data: FaqPageData;
  };
}

export interface TopLevelNavItemProps {
  sys: {
    id: string;
  };
  screenReaderOnlyCopy?: string;
  classes?: string;
  copy: string;
  url: string;
  subItemsCollection?: {
    items: LinkObjectProps[];
  };
}

export interface NavMenuData {
  navMenus: {
    heading?: string;
    url?: string;
    topLevelItemsCollection: {
      items: TopLevelNavItemProps[];
    };
  };
}

export interface NavMenuProps {
  data: {
    data: NavMenuData;
  };
}

/* ********************
 *  TRAINING
 ******************** */

export interface TabItemProps {
  sys: {
    id: string;
  };
  heading: string;
  copy: ContentfulRichText;
}

export interface TrainingProviderData {
  tabContent: {
    title: string;
    sys: {
      publishedAt: Date;
    };
    tabsCollection: {
      items: TabItemProps[];
    };
  };
}

export interface FinancialResourcePageProps {
  status?: number;
  data: {
    data: {
      page: {
        title: string;
        bannerHeading: string;
        bannerCopy: ContentfulRichText;
        bannerImage?: {
          url: string;
        };
        footerBannerTitle?: string;
        footerBannerCopy?: ContentfulRichText;
      };
      education: {
        items: {
          sys?: {
            id: string;
          };
          title: string;
          type: string;
        }[];
      };
      funding: {
        items: {
          sys?: {
            id: string;
          };
          title: string;
          type: string;
        }[];
      };
      resources: {
        items: {
          sys?: {
            id: string;
          };
          title: string;
          details: ContentfulRichText;
          link: string;
          taggedCatsCollection: {
            items: {
              sys?: {
                id: string;
              };
              title: string;
              color: string;
            }[];
          };
        };
      };
    };
  };
}

export interface TrainingProviderPageProps {
  data: {
    data: TrainingProviderData;
  };
}
