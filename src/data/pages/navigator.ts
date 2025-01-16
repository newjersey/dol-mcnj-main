import { CtaBannerProps } from "@components/blocks/CtaBanner";
import { RiverProps } from "@components/blocks/River";
import { HeadingLevel, IconCardProps, PageBannerProps } from "@utils/types";

export const NAVIGATOR_PAGE_DATA = {
  seo: {
    title: `New Jersey Career Navigator | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      "Use NJ Career Navigator for personalized career advice, training programs, and job opportunities in NJ. Provided by the NJ Department of Labor.",
    keywords: [
      "Career",
      "Job",
      "Training",
      "New Jersey",
      "Career Navigator",
      "My Career NJ",
    ],
    ogImage: {
      sys: {
        id: "buiOl5KtlbWd2n75TzD61",
      },
      url: "https://images.ctfassets.net/jbdk7q9c827d/buiOl5KtlbWd2n75TzD61/8614058229c32e1d4cfe2bb035b7746c/0d4a1adf-de41-46a6-b45a-75015bf737b3.png",
      title: "My Career NJ Title Card",
      width: 2400,
      height: 1260,
      fileName: "0d4a1adf-de41-46a6-b45a-75015bf737b3.png",
      contentType: "image/png",
    },
  },
  banner: {
    message: "Learn how to enter and advance a career in key NJ industries.",
    title: "NJ Career Navigator",
    section: "explore",
    theme: "blue",
    breadcrumbsCollection: {
      items: [
        {
          sys: {
            id: "50o1RGfZ173Cis7VEFlBDR",
          },
          copy: "Home",
          url: "/",
        },
      ],
    },
  } as PageBannerProps,
  opportunities: {
    sectionHeading: {
      heading: "Personalized Career Opportunities",
    },
    cards: [
      {
        sys: { id: "52EC9X2J4rT7M4osjaSl45" },
        copy: "Discover Personalized Job Openings",
        fill: true,
        url: "/navigator/#/jobs",
        icon: "Briefcase",
        theme: "blue",
        message: "Sign up to find current job openings based on your skills.",
      },
      {
        sys: { id: "1cU2jt1XCw0kmhlwfUD7pP" },
        fill: true,
        copy: "Explore Career Change Recommendations",
        theme: "purple",
        url: "/navigator/#/careers",
        icon: "MapTrifold",
        message: "Sign up to see new careers based on your skills.",
      },
    ] as IconCardProps[],
  },
  howTo: {
    sectionHeading: {
      heading: "How to use the Career Navigator",
    },
    cards: [
      {
        heading: "Sign Up",
        icon: "UserPlus",
        description:
          "Add your skills and experience to get personalized recommendations.",
      },
      {
        heading: "Explore Suggestions",
        icon: "Binoculars",
        description:
          "We compare your data to current job openings and the experience of other New Jerseyans to give recommendations that are best for you.",
      },
      {
        heading: "Take Action",
        icon: "CheckSquare",
        description:
          "Link to high-value training programs and open jobs to apply to.",
      },
    ],
  },
  midPageCta: {
    headingLevel: 2,
    noIndicator: true,
    inlineButtons: true,
    heading: "Start finding opportunities today.",
    items: [
      {
        sys: {
          id: "bhGAVbaJfPuVniKl3FoaO",
        },
        copy: "Log In",
        url: "/navigator/#/login",
      },
      {
        sys: {
          id: "44ygVngSycN2d1w5Zwb4x4",
        },
        copy: "Sign Up",
        url: "/navigator/#/login",
      },
    ],
  } as CtaBannerProps,
  ctaBanner: {
    fullColor: true,
    theme: "purple",
    headingLevel: 3,
    heading: "Not ready to sign up? Check out these other tools.",
    customLinks: [
      {
        iconPrefix: "GraduationCap",
        link: "/training",
        label: "NJ Training Explorer",
        type: "link",
        highlight: "blue",
      },
      {
        iconPrefix: "Fire",
        link: "/in-demand-occupations",
        label: "In-Demand Occupations",
        type: "link",
        highlight: "orange",
      },
      {
        iconPrefix: "Briefcase",
        link: "https://www.careeronestop.org/",
        label: "One Stop Job Board",
        type: "link",
        highlight: "navy",
      },
      {
        iconPrefix: "MapTrifold",
        link: "/career-pathways",
        label: "NJ Career Pathways",
        type: "link",
        highlight: "green",
      },
    ],
  } as CtaBannerProps,
  info: {
    sectionHeading: {
      heading: "Why use Career Navigator?",
      headingLevel: 3 as HeadingLevel,
    },
    cards: [
      {
        sys: {
          id: "73Cc15iWxF6VTufKikIgpv",
        },
        copy: "Data-Driven Career Recommendations",
        icon: "ThumbsUp",
        theme: "blue",
        message:
          "We use data and machine learning to give you the best possible career recommendations.",
      },
      {
        sys: {
          id: "4LpZgmuGMVCYlfCQizdOHB",
        },
        copy: "Continuous Improvement",
        icon: "Brain",
        theme: "green",
        message:
          "Your career recommendations will improve over time, as we learn more about you.",
      },
      {
        sys: {
          id: "3feeqiLzanHlVH3vzWeD6c",
        },
        copy: "Best-Fit Opportunities",
        theme: "purple",
        icon: "PuzzlePiece",
        message:
          "You'll be matched with best-fit job opportunities based on your existing skills, available jobs, and their potential to boost your income.",
      },
    ] as IconCardProps[],
  },
  footerCta: {
    inlineButtons: true,
    headingLevel: 3,
    heading: "Still have a question about the Career Navigator? ",
    items: [
      {
        sys: {
          id: "7pHmRVYgW7tVAELau6UYNU",
        },
        copy: "Contact Us",
        url: "https://mycareer.nj.gov/contact",
      },
    ],
  } as CtaBannerProps,
  river: {
    headingLevel: 4 as HeadingLevel,
    items: [
      {
        heading: "High Potential Career Pathways",
        copy: "Our algorithm presents you new career pathways that are informed by the successful transitions other New Jersey workers are making.",
        image: {
          url: "https://images.ctfassets.net/jbdk7q9c827d/1mlYyWt7tOpa9EAoPbmzvR/342507c4c5495b95fb4f900d3f70c735/Screenshot_2023-06-29_at_3.46.08_PM.png",
          description: "Woman looking at computer screen",
          height: 744,
          width: 1385,
        },
      },
      {
        heading: "Take Action Quickly",
        copy: "When you've decided on a new career, we know you want to get to work quickly. We help you take action by recommending high-value training programs and open jobs to apply to.",
        image: {
          url: "https://images.ctfassets.net/jbdk7q9c827d/3dWCGroualGdb35HvvwQdt/37d278ff80f1a9c531c9f85129e0874c/Screenshot_2023-06-29_at_3.46.26_PM.png",
          description: "Man looking at mobile device screen",
          height: 746,
          width: 1379,
        },
      },
    ],
  } as RiverProps,
};
