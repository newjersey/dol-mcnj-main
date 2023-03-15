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
  question: string;
  answer: ContentfulRichText;
  order: number;
  topic: FaqItemTopic;
}

export interface FaqTopic {
  topic: string;
  itemsCollection: {
    items: FaqItem[];
  };
}

export interface FaqPageProps {
  faqTopicCollection: {
    items: FaqTopic[];
  };
}

export interface ContentfulFAQQuery {
  status: number;
  data: {
    data: {
      faqTopicCollection: { items: FaqTopic[] };
    };
  };
}

/* ********************
 *  TRAINING
 ******************** */
interface TrainingProviderTopic {
  topic: string;
  order: number;
}

interface TrainingProviderItem {
  title: string;
  hide: boolean;
  description: JSON;
  order: number;
  topic: TrainingProviderTopic;
}

// export interface ContentfulQuery {
//   [propName: string]: string | string[] | Keypair | Keypair[] | faqItemCollection | TrainingProviderItem | TrainingProviderItem[];
// }
