import { Document } from "@contentful/rich-text-types";

/* ********************
 *  GENERIC
 ******************** */
export interface Keypair {
  key: string;
  value: string | Keypair | Keypair[];
}

/* ********************
 *  FAQ
 ******************** */
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
