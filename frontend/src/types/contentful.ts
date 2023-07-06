import { Document } from "@contentful/rich-text-types";
import { ReactNode } from "react";
import { IconNames } from "./icons";
import * as Svg from "../svg/Icons";

export type ThemeColors = "navy" | "blue" | "green" | "purple" | "orange";

export type SectionIcons =
  | "explore"
  | "jobs"
  | "support"
  | "training"
  | "exploreBold"
  | "jobsBold"
  | "supportBold"
  | "trainingBold";

export type HeadingLevel = 2 | 3 | 4 | 5 | 6;

/* ********************
 *  GENERIC
 ******************** */
export interface Keypair {
  key: string;
  value: string | Keypair | Keypair[];
}

export interface ImageProps {
  url: string;
  width?: number;
  height?: number;
}

export interface OccupationNodeProps {
  sys: {
    id: string;
  };
  level: number;
  title: string;
  inDemand?: boolean;
  shortTitle?: string;
  description: string;
  medianSalary?: number;
  numberOfAvailableJobs?: number;
  trainingSearchTerms?: string;
  salaryRangeStart: number;
  salaryRangeEnd: number;
  educationLevel: string;
  advancement?: string;
  tasks?: string;
  education?: string;
  credentials?: string;
  skills?: string;
  experience?: string;
}

export interface SelectProps {
  pathway?: OccupationNodeProps[];
  title?: string;
  shortTitle?: string;
  id?: string;
  groupId?: string;
  groupTitle?: string;
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
  theme?: ThemeColors;
  title: string;
  breadcrumbTitle?: string;
  breadcrumbsCollection: {
    items: LinkObjectProps[];
  };
  section: SectionIcons;
  message?: ContentfulRichText;
  description?: string;
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
  iconPrefix?: IconNames;
  iconSuffix?: IconNames;
  svgFill?: boolean;
  svgName?: keyof typeof Svg;
  highlight?: ThemeColors;
  url: string;
  screenReaderOnlyCopy?: string;
  children?: ReactNode;
  icon?: IconNames;
  icons?: boolean;
  onClick?: () => void;
  customSvg?: string;
  label?: string;
  description?: string;
}

export interface FaqPageData {
  page: {
    sys: {
      publishedAt: Date;
    };
    pageBanner: PageBannerProps;
    title: string;
    bannerHeading: string;
    bannerImage?: ImageProps;
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
    bannerImage: ImageProps;
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

export interface TrainingExplorerPageProps {
  trainingExplorerPage: {
    demoVideoUrl: string;
    faqsCollection: { items: FaqItem[] };
    footerCtaHeading: string;
    footerCtaLinkCollection: { items: LinkObjectProps[] };
    interrupterBannerHeading: string;
    interrupterLinksCollection: { items: LinkObjectProps[] };
    pageBanner: PageBannerProps;
    stepOneHeading: string;
    stepOneIcon: IconNames;
    stepOneText: string;
    stepThreeHeading: string;
    stepThreeIcon: IconNames;
    stepThreeText: string;
    stepTwoHeading: string;
    stepTwoIcon: IconNames;
    stepTwoText: string;
    title: string;
  };
}

export interface IconLinkProps {
  sys: {
    id: string;
  };
  icon?: IconNames;
  sectionIcon?: SectionIcons;
  copy: string;
  url: string;
  description?: string;
}

export interface HomepageProps {
  homePage: {
    title: string;
    pageDescription?: string;
    bannerButtonCopy: string;
    bannerImage?: ImageProps;
    toolsCollection: {
      items: IconLinkProps[];
    };
    jobSearchToolLinksCollection: {
      items: IconLinkProps[];
    };
    trainingToolLinksCollection: {
      items: IconLinkProps[];
    };
    careerExplorationToolLinksCollection: {
      items: IconLinkProps[];
    };
    supportAndAssistanceLinksCollection: {
      items: IconLinkProps[];
    };
  };
}

export interface AllSupportPageProps {
  page: {
    title: string;
    pageBanner: PageBannerProps;
    footerCtaHeading: string;
    footerCtaLink: LinkObjectProps;
    industries: {
      items: IndustryProps[];
    };
  };
  categories: {
    items: {
      sys: {
        id: string;
      };
      title: string;
      slug: string;
      description?: string;
    }[];
  };
}

export interface TagProps {
  sys: {
    id: string;
  };
  title: string;
  category: {
    slug: string;
  };
}

export interface RelatedCategoryProps {
  sys: {
    id: string;
  };
  title: string;
  slug: string;
}

export interface ResourceCategoryPageProps {
  page: {
    items: {
      sys: {
        id: string;
      };
      title: string;
      slug: string;
      description?: string;
      infoBox?: string;
      related?: {
        items: RelatedCategoryProps[];
      };
    }[];
  };
  tags: {
    items: TagProps[];
  };
  audience: {
    items: TagProps[];
  };
  cta: {
    footerCtaHeading: string;
    footerCtaLink: LinkObjectProps;
  };
}

export interface ResourceItemProps {
  sys: {
    id: string;
  };
  title: string;
  description: string;
  link: string;
  tags: {
    items: TagProps[];
  };
}
export interface ResourceListProps {
  resources: {
    items: ResourceItemProps[];
  };
}

export interface IconCardProps {
  sys?: {
    id: string;
  };
  heading: string;
  icon: IconNames;
  sectionItem?: SectionIcons;
  description: string;
}

export interface CareerNavigatorPageProps {
  page: {
    title: string;
    pageBanner: PageBannerProps;
    footerCtaHeading: string;
    footerCtaLink: LinkObjectProps;
    stepsHeading?: string;
    midPageCtaHeading?: string;
    interrupterHeading?: string;
    interrupterLinks?: {
      items: LinkObjectProps[];
    };
    infoHeading?: string;
    infoCards?: {
      items: IconCardProps[];
    };
    midPageCtaLinks?: {
      items: LinkObjectProps[];
    };
    opportunitiesHeading?: string;
    opportunityCards: {
      items: LinkObjectProps[];
    };
    stepsCollection: {
      items: IconCardProps[];
    };
    river?: {
      items: {
        sys: {
          id: string;
        };
        copy?: string;
        heading?: string;
        image: ImageProps;
      }[];
    };
  };
}
