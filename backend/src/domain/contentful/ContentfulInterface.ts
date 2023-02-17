interface FaqItemTopic {
  topic: string;
  order: number;
}

interface FaqTopicCollection {
  status: number;
  data: {
    data: {
      faqItemCollection: {
        items: FaqItemTopic[];
      }
    }
  }
}

interface FaqItem {
  question: string;
  answer: JSON;
  order: number;
  topic: FaqItemTopic;
}

interface faqItemCollection {
  status: number;
  data: {
    data: {
      faqItemCollection: {
        items: FaqItem[];
      }
    }
  }
}

interface TrainingProviderItem {
  title: string;
  hide: boolean;
  description: JSON;
  order: number;
  topic: TrainingProviderTopic;
}

interface TrainingProviderTopic {
  topic: string;
  order: number;
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
      }
      faqItemCollection: {
        items: FaqItem[];
      }
    }
  }
}