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
  copy: string;
  url: string;
}

export interface LinkGroupProps {
  heading: string;
  linksCollection: {
    items: LinkObjectProps[];
  };
}

export interface FaqPageProps {
  status?: number;
  data: {
    data: {
      faqCollection: {
        title: string;
        topicsCollection: {
          items: FaqTopic[];
        };
        linkGroup: LinkGroupProps;
      };
    };
  };
}

export interface TabItemProps {
  sys: {
    id: string;
  };
  heading: string;
  copy: ContentfulRichText;
}

export interface TrainingProviderPageProps {
  status?: number;
  data: {
    data: {
      tabContent: {
        title: string;
        sys: {
          publishedAt: Date;
        };
        tabsCollection: {
          items: TabItemProps[];
        };
      };
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
