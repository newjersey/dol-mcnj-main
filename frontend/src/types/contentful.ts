import { Document } from "@contentful/rich-text-types";
import { ReactNode } from "react";

/* ********************
 *  GENERIC
 ******************** */
export interface Keypair {
  key: string;
  value: string | Keypair | Keypair[];
}

export interface OccupationNodeProps {
  sys: {
    id: string;
  };
  level?: number;
  title: string;
  inDemand?: boolean;
  shortTitle?: string;
  description: string;
  trainingSearchTerms?: string;
  salaryRangeStart: number;
  salaryRangeEnd: number;
  educationLevel: 1 | 2 | 3 | 4;
  advancement?: string;
  tasks?: string;
  education?: string;
  credentials?: string;
  skills?: string;
  experience?: string;
}

export interface SinglePathwayProps {
  sys: {
    id: string;
  };
  title: string;
  occupationsCollection: {
    items: OccupationNodeProps[];
  };
}

export interface CareerMapNodeProps extends OccupationNodeProps {
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

export interface PathwayGroupProps {
  title: string;
  sys: {
    id: string;
  };
  pathways?: {
    items: SinglePathwayProps[];
  };
}

export interface FaqItemTopic {
  topic: string;
  order: number;
}

export interface PageBannerProps {
  date?: Date;
  title: string;
  breadcrumbTitle?: string;
  breadcrumbsCollection: {
    items: LinkObjectProps[];
  };
  section: "explore" | "jobs" | "support" | "training";
  message?: ContentfulRichText;
  ctaHeading?: string;
  ctaLinksCollection?: {
    items: LinkObjectProps[];
  };
}

export interface AssetBlock {
  sys: {
    id: string;
  };
  url?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  contentType?: string;
}

export interface ContentfulRichText {
  json: Document;
  links?: {
    assets: {
      block: AssetBlock[];
    };
  };
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
  className?: string;
  url: string;
  screenReaderOnlyCopy?: string;
  children?: ReactNode;
  icons?: boolean;
  label?: string;
}

export interface FaqPageData {
  page: {
    sys: {
      publishedAt: Date;
    };
    pageBanner: PageBannerProps;
    title: string;
    bannerHeading: string;
    bannerImage?: {
      url: string;
    };
    topics: {
      items: FaqTopic[];
    };
    resourceLinkHeading?: string;
    resourceLinks: {
      items: LinkObjectProps[];
    };
  };
}

export interface FaqPageProps {
  data: {
    data: FaqPageData;
  };
}

export interface CareerMapProps {
  sys: {
    id: string;
  };
  title: string;
}

export interface IndustryProps {
  sys: {
    id: string;
  };
  title: string;
  shorthandTitle?: string;
  slug: "manufacturing" | "healthcare" | "tdl";
  description: ContentfulRichText;
  photo: {
    url: string;
    width: number;
    height: number;
  };
  careerMaps?: {
    items: CareerMapProps[];
  };
  inDemandCollection?: {
    items: {
      sys: {
        id: string;
      };
      title: string;
      idNumber: string;
      numberOfJobs?: number;
    }[];
  };
  industryAccordionCollection: {
    items: {
      sys: {
        id: string;
      };
      title: string;
      copy: ContentfulRichText;
      icon?: {
        url: string;
      };
    }[];
  };
}

export interface CareerPathwaysPageData {
  page: {
    sys: {
      publishedAt: Date;
    };
    title: string;
    pageBanner: PageBannerProps;
    footerCtaHeading: string;
    footerCtaLink: LinkObjectProps;
    industries: {
      items: IndustryProps[];
    };
  };
}

export interface CareerPathwaysPageProps {
  data: {
    data: CareerPathwaysPageData;
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
  page: {
    sys: {
      publishedAt: Date;
    };
    pageBanner: PageBannerProps;
    title: string;
    bannerHeading: string;
    bannerImage: {
      url: string;
    };
    tabs: {
      items: TabItemProps[];
    };
  };
}

export interface TrainingProviderPageProps {
  data: {
    data: TrainingProviderData;
  };
}

export interface FinResourcePageProps {
  sys: {
    publishedAt: Date;
  };
  pageBanner: PageBannerProps;
  title: string;
  bannerHeading: string;
  bannerCopy: ContentfulRichText;
  bannerImage?: {
    url: string;
  };
  footerBannerTitle?: string;
  footerBannerCopy?: ContentfulRichText;
}

export interface FinResourceTypeProps {
  items: {
    sys?: {
      id: string;
    };
    title: string;
    type: string;
    color: string;
  }[];
}

export interface FinResourceItemProps {
  sys?: {
    id: string;
  };
  title: string;
  details: ContentfulRichText;
  link: string;
  taggedCatsCollection: FinResourceTypeProps;
}
export interface FinResourceProps {
  items: FinResourceItemProps[];
}

export interface FinancialResourcePageData {
  page: FinResourcePageProps;
  education: FinResourceTypeProps;
  funding: FinResourceTypeProps;
  resources: FinResourceProps;
}

export interface FinancialResourcePageProps {
  status?: number;
  data: {
    data: FinancialResourcePageData;
  };
}
