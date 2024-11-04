import * as Svg from "@components/svgs";
import * as Icons from "@phosphor-icons/react";
import { IconNames } from "@utils/enums";
import {
  BreakNames,
  CalendarLength,
  Elements,
  Gaps,
  SectionIcons,
  ThemeColors,
} from "./types";
import { CSSProperties, ReactNode } from "react";
import { Document } from "@contentful/rich-text-types";

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface ComponentProps {
  className?: string;
  testId?: string;
  componentId?: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface FlexGridProps extends ComponentProps {
  children: ReactNode;
  elementTag?: Elements;
  role?: string;
  ariaLabel?: string;
  style?: CSSProperties;
  gap?: Gaps;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface FlexProps extends FlexGridProps {
  alignItems?: "center" | "flex-start" | "flex-end" | "stretch";
  breakpoint?: BreakNames;
  center?: boolean;
  columnBreak?: BreakNames;
  customLayout?:
    | `one-third-two-thirds`
    | `two-thirds-one-third`
    | `one-quarter-three-quarters`
    | `three-quarters-one-quarter`;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  fill?: boolean;
  flexWrap?: "wrap" | "nowrap" | "wrap-reverse";
  justifyContent?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around";
  noBreak?: boolean;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface CardSliderProps {
  className?: string;
  heading?: string;
  sectionId?: string;
  cards: {
    sys: {
      id: string;
    };
    icon?: IconNames;
    sectionIcon?: SectionIcons;
    copy: string;
    url: string;
    description?: string;
  }[];
  theme?: ThemeColors;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface NavMenuProps {
  sys: {
    id: string;
  };
  title: string;
  heading?: string;
  url?: string;
  topLevelItemsCollection: {
    items: TopNavItemProps[];
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface TopicProps {
  sys: { id: string };
  topic: string;
  itemsCollection: { items: FaqItem[] };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface TopicGroupProps {
  title: string;
  topics: TopicProps[];
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface IconCardProps extends MediaObjectProps {
  alignLeft?: boolean;
  centered?: boolean;
  theme?: ThemeColors;
  className?: string;
  fill?: boolean;
  hoverFill?: boolean;
  indicator?: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface PageBannerProps {
  className?: string;
  ctaHeading?: string;
  ctaLinks?: LinkProps[];
  breadcrumbsCollection?: { items: LinkProps[] };
  eyebrow?: string;
  finalCrumb?: string;
  subHeading?: string;
  buttonCopy?: string;
  theme: ThemeColors;
  image?: ImageProps;
  message?: ContentfulRichTextProps;
  inDemand?: boolean;
  saveButtons?: ReactNode;
  title: string;
  highlightsCollection?: {
    items: {
      copy: string;
      sys: { id: string };
      url: string;
      value: string;
    }[];
  };
  infoBlocks?: {
    ctaLink?: LinkProps;
    costBlock?: {
      copy: string;
      number: string | number;
      definition: string;
    };
    rateBlock?: {
      copy: string;
      number: string | number;
      definition: string;
    };
    titleBlock?: {
      copy: string;
      message?: string;
      link?: LinkProps;
    };
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface ImageProps {
  sys: {
    id: string;
  };
  url: string;
  title?: string;
  description?: string;
  width: number;
  height: number;
  fileName?: string;
  contentType?: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface MinimalImageProps {
  url: string;
  width: number;
  height: number;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface LinkProps {
  sys?: {
    id: string;
  };
  url?: string;
  copy?: string;
  screenReaderOnlyCopy?: string;
  children?: ReactNode;
  icon?: IconNames;
  systemIcon?: SectionIcons;
  message?: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface CipDefinition {
  cip: string;
  cipcode: string;
  ciptitle: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface OccupationListItemProps {
  className?: string;
  title: string;
  items: {
    soc: string;
    title: string;
    majorGroup: string;
    counties: string[];
  }[];
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface NavItemProps {
  sys: {
    id: string;
  };
  copy: string;
  screenReaderOnlyCopy?: string;
  classes?: string;
  url?: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface TopNavItemProps extends NavItemProps {
  subItemsCollection?: { items: NavItemProps[] };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface ButtonProps {
  buttonId?: string;
  children?: ReactNode;
  className?: string;
  loading?: boolean;
  customBgColor?: string;
  customBorderColor?: string;
  customTextColor?: string;
  defaultStyle?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "quaternary"
    | "quinary"
    | "cool";
  disabled?: boolean;
  fontColor?: string;
  highlight?: ThemeColors;
  iconPrefix?: keyof typeof Icons;
  iconSuffix?: keyof typeof Icons;
  iconWeight?: string;
  info?: boolean;
  label?: string;
  link?: string;
  noIndicator?: boolean;
  onClick?: (e?: any) => void;
  outlined?: boolean;
  role?: string;
  svgFill?: boolean;
  svgName?: keyof typeof Svg;
  tag?: boolean;
  type: "button" | "link" | "submit";
  unstyled?: boolean;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface RiverItemProps {
  sys: {
    id: string;
  };
  heading: string;
  copy: string;
  image: ImageProps;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface SvgProps {
  color?: string;
  size?: number;
  className?: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface ContentfulRichTextProps {
  json: Document;
  links?: {
    assets: {
      block: AssetBlock[];
    };
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface ResourceTagProps {
  sys: {
    id: string;
  };
  title: string;
  category: {
    sys: {
      id: string;
    };
    title: string;
    slug: string;
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface TabItemProps {
  sys: {
    id: string;
  };
  heading: string;
  copy: ContentfulRichTextProps;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

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
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface FaqItemTopic {
  topic: string;
  order: number;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface FaqItem {
  sys: {
    id: string;
  };
  question: string;
  answer: ContentfulRichTextProps;
  category: string;
  topic: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface FaqTopic {
  sys: {
    id: string;
  };
  topic: string;
  itemsCollection?: {
    items: FaqItem[];
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface TagProps {
  sys: {
    id: string;
  };
  title: string;
  category: {
    sys: {
      id: string;
    };
    title: string;
    slug: string;
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface RelatedCategoryProps {
  sys: {
    id: string;
  };
  title: string;
  slug: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface ResourceCardProps {
  sys: {
    id: string;
  };
  className?: string;
  description: string;
  link: string;
  tagsCollection: {
    items: {
      sys: {
        id: string;
      };
      title: string;
      category: {
        sys: {
          id: string;
        };
      };
    }[];
  };
  theme?: ThemeColors;
  title: string;
}

// PAGES

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface MediaObjectsArrayProps {
  heading?: string;
  subheading?: string;
  items: MediaObjectProps[];
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface MediaObjectProps {
  sys: {
    id: string;
  };
  url?: string;
  copy?: string;
  icon?: IconNames;
  systemIcon?: SectionIcons;
  message?: string;
  description?: string;
  image?: ImageProps;
  links?: LinkProps[];
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface TrainingProps {
  id: string;
  name: string;
  description: string;
  inDemand: boolean;
  percentEmployed?: number;
  averageSalary?: number;
  localExceptionCounty: string[];
  prerequisites?: string;
  certifications?: string;
  totalCost?: number;
  calendarLength?: number;
  totalClockHours?: number;
  cipDefinition?: CipDefinition;
  occupations?: {
    soc: string;
    title: string;
  }[];
  tuitionCost: number;
  feesCost: number;
  booksMaterialsCost: number;
  suppliesToolsCost: number;
  otherCost: number;
  online: boolean;
  hasEveningCourses: boolean;
  languages: string[];
  isWheelchairAccessible: boolean;
  hasJobPlacementAssistance: boolean;
  hasChildcareAssistance: boolean;
  provider: {
    contactName: string;
    contactTitle: string;
    phoneNumber: string;
    phoneExtension?: string;
    url: string;
    name: string;
    address: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode?: string;
    };
    county: string;
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface TrainingResult {
  id: string;
  name: string;
  cipCode: string;
  totalCost: number;
  percentEmployed: number | null;
  calendarLength: CalendarLength;
  totalClockHours: number;
  inDemand: boolean;
  localExceptionCounty: string[];
  online: boolean;
  providerId: string;
  providerName: string;
  city: string;
  zipCode: string;
  county: string;
  highlight: string;
  rank: number;
  socCodes: string[];
  hasEveningCourses: boolean;
  languages: string[];
  isWheelchairAccessible: boolean;
  hasJobPlacementAssistance: boolean;
  hasChildcareAssistance: boolean;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface FetchResultsProps {
  itemCount: number;
  pageData: ResultProps[];
  pageNumber: number;
  searchParams: string;
  searchParamsArray: { key: string; value: string }[];
  totalPages: number;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface ResultProps {
  id: string;
  name: string;
  cipDefinition: CipDefinition;
  cipCode?: string;
  totalCost?: number;
  percentEmployed?: number;
  calendarLength?: number;
  localExceptionCounty?: [];
  online?: boolean;
  providerId?: string;
  providerName?: string;
  city?: string;
  zipCode: string;
  county?: string;
  inDemand?: boolean;
  highlight?: string;
  rank?: number;
  socCodes?: string[];
  hasEveningCourses?: boolean;
  languages?: string[];
  isWheelchairAccessible?: boolean;
  hasJobPlacementAssistance?: boolean;
  hasChildcareAssistance?: boolean;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface InDemandItemProps {
  title: string;
  idNumber: string;
  numberOfJobs?: number;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface IndustryProps {
  sys: {
    id: string;
  };
  title: string;
  shorthandTitle?: string;
  slug: "manufacturing" | "healthcare" | "tdl";
  description: ContentfulRichTextProps;
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
      copy: ContentfulRichTextProps;
      icon?: {
        url: string;
      };
    }[];
  };
}

////////////////////////////////////////////////////////
//////////////////////////////////////////////////////

// export interface CareerMapProps {
//   sys: {
//     id: string;
//   };
//   title: string;
//   learnMoreBoxes: {
//     title?: string;
//     copy?: string;
//     tags?: string[];
//   }[];
// }

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface CareerMapProps {
  careerMap: {
    sys: {
      id: string;
    };
    title: string;
    learnMoreBoxes?: {
      title?: string;
      copy?: string;
      tags?: string[];
    }[];
    pathways?: {
      items: SinglePathwayProps[];
    };
  };
}
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface SinglePathwayProps {
  sys: {
    id: string;
  };
  title: string;
  occupationsCollection: {
    items: OccupationNodeProps[];
  };
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface Occupation {
  soc: string;
  title: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface OccupationDetail {
  soc: string;
  title: string;
  description: string;
  tasks: string[];
  education: string;
  inDemand: boolean;
  counties?: string[];
  medianSalary: number | null;
  openJobsCount: number | null;
  openJobsSoc?: number;
  relatedOccupations: Occupation[];
  relatedTrainings: TrainingResult[];
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface IntroBlockSectionProps {
  link?: {
    copy?: string;
    url?: string;
  };
  title?: string;
  heading?: string;
  message?: string;
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface IntroBlocksProps {
  heading?: string;
  message?: string;
  sectionsHeading?: string;
  sections?: IntroBlockSectionProps[];
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

export interface FormInputProps {
  ariaLabel?: string;
  checked?: boolean;
  className?: string;
  counter?: { limit: number; count: number };
  defaultChecked?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  hideLabel?: boolean;
  inputClass?: string;
  inputId: string;
  label: string;
  labelClass?: string;
  name?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlurArea?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlurSelect?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeArea?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeSelect?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: { key: string; value: string }[];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  type:
    | "text"
    | "email"
    | "password"
    | "checkbox"
    | "radio"
    | "select"
    | "textarea"
    | "number"
    | "date"
    | "time"
    | "url"
    | "week"
    | "month"
    | "tel"
    | "search"
    | "color"
    | "datetime-local"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "range"
    | "reset"
    | "submit"
    | "time"
    | "url"
    | "week";
  value?: string;
  variant?: "switch";
}
