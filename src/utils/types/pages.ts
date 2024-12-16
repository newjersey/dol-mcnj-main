import { IconNames } from "@utils/enums";
import {
  ContentfulRichTextProps,
  FaqItem,
  IconCardProps,
  IconLinkProps,
  ImageProps,
  IndustryProps,
  IntroBlocksProps,
  LinkProps,
  MediaObjectsArrayProps,
  PageBannerProps,
  RelatedCategoryProps,
  ResourceCardProps,
  ResultProps,
  RiverItemProps,
  SectionIcons,
  TabItemProps,
  TagProps,
} from ".";
import { NavMenuProps } from "./components";

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface GlobalPageProps {
  footerNav1: NavMenuProps;
  footerNav2: NavMenuProps;
  globalNav: NavMenuProps;
  mainNav: NavMenuProps;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface PageMetaProps {
  title: string;
  pageDescription?: string;
  ogImage?: ImageProps;
  keywords?: string[];
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface HomepageProps {
  pageData: any;
  homePage: PageMetaProps & {
    pageDescription?: string;
    bannerButtonCopy: string;
    bannerMessage?: string;
    bannerImage?: ImageProps;
    introBlocks?: IntroBlocksProps;
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

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface CareerNavigatorProps {
  page: PageMetaProps & {
    pageBanner: PageBannerProps;
    footerCtaHeading: string;
    footerCtaLink: LinkProps;
    stepsHeading?: string;
    midPageCtaHeading?: string;
    interrupterHeading?: string;
    interrupterLinks?: {
      items: LinkProps[];
    };
    infoHeading?: string;
    infoCards?: {
      items: {
        sys: {
          id: string;
        };
        heading?: string;
        icon?: IconNames;
        description?: string;
        sectionIcon?: SectionIcons;
      }[];
    };
    midPageCtaLinks?: {
      items: LinkProps[];
    };
    opportunitiesHeading?: string;
    opportunityCards: {
      items: {
        sys: {
          id: string;
        };
        copy?: string;
        screenReaderOnlyCopy?: string;
        url?: string;
        icon?: IconNames;
        customSvg?: string;
        description?: string;
      }[];
    };
    stepsCollection: {
      items: IconCardProps[];
    };
    river?: {
      items: RiverItemProps[];
    };
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface CareerPathwaysPageProps {
  pageData: any;
  page: PageMetaProps & {
    pageBanner: PageBannerProps;
    stepsHeading?: string;
    stepsCollection: {
      items: IconCardProps[];
    };
    exploreSection: MediaObjectsArrayProps;
    industries: {
      items: IndustryProps[];
    };
    exploreHeading: string;
    exploreButtonsCollection: { items: LinkProps[] };
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface FaqPageProps {
  page: PageMetaProps & {
    sys: {
      publishedAt: Date;
    };
    pageBanner: PageBannerProps;
    bannerHeading: string;
    bannerImage?: ImageProps;
    categoriesCollection: {
      items: {
        sys: { id: string };
        title: string;
        topics: {
          items: {
            sys: { id: string };
            topic: string;
            itemsCollection: { items: FaqItem[] };
          }[];
        };
      }[];
    };
    resourceLinkHeading?: string;
    resourceLinks: {
      items: LinkProps[];
    };
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface TrainingExplorerPageProps {
  pageData: any;
  page: PageMetaProps & {
    demoVideoUrl: string;
    faqsCollection: { items: FaqItem[] };
    footerCtaHeading: string;
    footerCtaLinkCollection: { items: LinkProps[] };
    interrupterBannerHeading: string;
    interrupterLinksCollection: { items: LinkProps[] };
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
    drawerContent: ContentfulRichTextProps;
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface SupportResourcesPageProps {
  pageData: any;
  page: PageMetaProps & {
    pageBanner: PageBannerProps;
    footerCtaHeading: string;
    footerCtaLink: LinkProps;
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

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface TrainingProviderPageData {
  page: PageMetaProps & {
    sys: {
      publishedAt: Date;
    };
    pageBanner: PageBannerProps;
    bannerHeading: string;
    bannerImage: ImageProps;
    tabs: {
      items: TabItemProps[];
    };
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

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
    footerCtaLink: LinkProps;
  };
  listingItems: {
    resources: {
      items: ResourceCardProps[];
    };
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface OccupationPageProps {
  soc: string;
  title: string;
  description: string;
  tasks: string[];
  relatedOccupations: {
    soc: string;
    title: string;
  }[];
  education?: string;
  inDemand?: boolean;
  counties: string[];
  medianSalary?: number;
  openJobsCount?: number | null;
  openJobsSoc?: string;
  relatedTrainings: ResultProps[];
}
