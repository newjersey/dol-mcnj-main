interface FaqItemTopic {
  topic: string;
  order: number;
}

interface FaqItem {
  question: string;
  answer: JSON;
  order: number;
  topic: FaqItemTopic;
}

export interface Keypair {
  key: string;
  value: string | Keypair | Keypair[];
}

export interface ContentfulFAQQuery {
  status: number;
  data: {
    data: {
      faqTopicCollection: {
        items: FaqItemTopic[];
      };
      faqItemCollection: {
        items: FaqItem[];
      };
    };
  };
}
