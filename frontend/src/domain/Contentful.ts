import { Document } from '@contentful/rich-text-types';

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

export interface FaqItemAnswer {
  json: Document;
}

export interface FaqItem {
  question: string;
  answer: FaqItemAnswer;
  order: number;
  topic: FaqItemTopic;
}

export interface FaqItems {
  items: FaqItem[];
}

export interface ContentfulFAQQuery {
  status: number;
  data: {
    data: {
      faqTopicCollection: {
        items: FaqItemTopic[];
      }
      faqItemCollection: {
        items: FaqItem[];
      }
    }
  }
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