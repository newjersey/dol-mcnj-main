import { PageBannerProps } from "@utils/types";

export const HOMEPAGE_DATA = {
  seo: {
    title: process.env.REACT_APP_SITE_NAME,
    pageDescription:
      "Explore My Career NJ to find job training, career resources, and employment opportunities with the New Jersey Department of Labor.",
    keywords: [
      "Career",
      "Job Training",
      "Resources",
      "Tuition Assistance",
      "Career Pathways",
      "Training Explorer",
      "New Jersey Training Explorer",
      "Career Navigator",
      "My Career NJ",
      "jobs",
      "nj jobs",
      "Career Resources NJ",
      "Job Training NJ",
      "New Jersey Career Pathways",
      "NJ Training Explorer",
      "Career Navigator NJ",
      "Tuition Assistance NJ",
      "Apprenticeship Programs NJ",
      "New Jersey Department of Labor",
      "NJ Job Search Tools",
      "In-Demand Occupations NJ",
      "Professional Development NJ",
      "Career Support NJ",
      "NJ Career Guidance",
      "Job Search Help NJ",
      "Career Services NJ",
      "NJ Workforce Development",
      "Free Online Training NJ",
      "NJ Labor Market Information",
      "Community College Assistance NJ",
      "Training Provider Resources NJ",
      "Career resources in Bergen County",
      "Job training in Passaic County",
      "Workforce development in Hudson County",
      "Employment opportunities in Essex County",
      "Career Navigator in Morris County",
      "Job assistance in Middlesex County",
      "Training programs in Somerset County",
      "Career services in Mercer County",
      "Employment support in Monmouth County",
      "Workforce development in Union County",
      "Career resources in Camden County",
      "Job training in Burlington County",
      "Workforce development in Atlantic County",
      "Employment opportunities in Gloucester County",
      "Career Navigator in Ocean County",
      "Employment services in Newark, NJ",
      "Job support in Jersey City, NJ",
      "Career training in Trenton, NJ",
      "Job assistance in Atlantic City, NJ",
      "Workforce programs in Paterson, NJ",
    ],
    ogImage: {
      url: "https://images.ctfassets.net/jbdk7q9c827d/buiOl5KtlbWd2n75TzD61/8614058229c32e1d4cfe2bb035b7746c/0d4a1adf-de41-46a6-b45a-75015bf737b3.png",
      title: "My Career NJ Title Card",
      width: 2400,
      height: 1260,
      fileName: "0d4a1adf-de41-46a6-b45a-75015bf737b3.png",
      contentType: "image/png",
    },
  },
  banner: {
    title: "My Career NJ",
    theme: "blue",
    buttonCopy: "Explore My Career NJ",
    subHeading: "The tools you need to find a job that works for you.",
    message:
      "The right job is out there— if you know where to look for it. MyCareerNJ is a great place to start, with job listings throughout the state of New Jersey. We can also help you discover career possibilities, learn new job skills, assist with career changes, and offer advice for new employees. See for yourself how MyCareerNJ can help you.",
    image: {
      url: "https://images.ctfassets.net/jbdk7q9c827d/JAzMHNRnrmPy5KfO7l3PZ/c39660e2d16c0b5bf98fe3c05ab38dc3/NJCC_Hero_Image.png",
      description: "Four images of people working in various industries",
      height: 521,
      width: 750,
    },
  } as PageBannerProps,
  introBlocks: {
    heading:
      "No matter where you are on your career journey, My Career NJ is here to help you.",
    message:
      "Explore a connected suite of career, job, and training tools to help level up your career.",
    sections: [
      {
        link: {
          url: "/training",
          copy: "Visit the NJ Training Explorer",
        },
        title: "NJ Training Explorer",
        heading:
          "Certifications, Professional Development, Apprenticeships & More!",
        message:
          "Search by job, training program, and more to find a training that works for you. In-demand trainings may even be eligible for funding assistance. ",
      },
      {
        link: {
          url: "/navigator",
          copy: "Visit the NJ Career Navigator",
        },
        title: "NJ Career Navigator",
        heading: "Personalized Career Recommendations",
        message:
          "Get personalized, data-driven career recommendations based on your skills and experience.",
      },
      {
        link: {
          url: "/career-pathways",
          copy: "Visit the NJ Career Pathways",
        },
        title: "NJ Career Pathways",
        heading: "Explore Pathways to In-Demand Careers",
        message:
          "Uncover career opportunities and growth potential in key industries across New Jersey. From healthcare to manufacturing, Career Pathways provides the roadmap to help you navigate your journey to success.",
      },
    ],
    sectionsHeading: "How My Career NJ can help you:",
  },
  sectionHeading: {
    heading: "Explore Tools",
    strikeThrough: true,
  },
  sections: [
    {
      copy: "Find a Job",
      sectionId: "jobs",
      theme: "blue",
      heading: "All Job Search Tools",
      cards: [
        {
          copy: "NJ Career Navigator",
          url: "/navigator",
          description: "Get personalized career change recommendations",
        },
        {
          copy: " In-Demand Occupations List",
          url: "/in-demand-occupations",
          description: "See careers with openings now and in the future in NJ",
        },
        {
          copy: "CareerOneStop Job Board",
          url: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=25&source=NLX&curPage=1&referer=%2FToolkit%2FJobs%2Ffind-jobs.aspx",
          description: "Search for current job openings in New Jersey",
        },
        {
          copy: "Labor Market Information",
          url: "https://www.nj.gov/labor/labormarketinformation/",
          description: "Learn about the labor market in NJ",
        },
        {
          copy: "Apprenticeship Programs",
          url: "https://www.nj.gov/labor/career-services/apprenticeship/",
          description: "Learn about apprenticeship opportunities",
        },
      ],
    },
    {
      copy: "Get Training",
      sectionId: "training",
      theme: "green",
      heading: "All Training Tools",
      cards: [
        {
          sectionIcon: "training",
          copy: "NJ Training Explorer",
          url: "/training",
          description: "Search for training programs in NJ",
        },
        {
          sectionIcon: "training",
          copy: "NJ Career Navigator",
          url: "/navigator",
          description: "Get personalized career change recommendations",
        },
        {
          sectionIcon: "training",
          copy: "Tuition Assistance Resources",
          url: "/support-resources/tuition-assistance",
          description: "Learn about ways to get help paying for education",
        },
        {
          sectionIcon: "training",
          copy: "Training Provider Resources",
          url: "/training-provider-resources",
          description: "Important information for training providers",
        },
        {
          sectionIcon: "training",
          copy: "SkillUp",
          url: "https://nj.metrixlearning.com/landing.cfm",
          description: "Free on-line training videos",
        },
      ],
    },
    {
      copy: "Explore Careers",
      sectionId: "explore",
      theme: "purple",
      heading: "All Career Exploration Resources",
      cards: [
        {
          sectionIcon: "jobs",
          copy: "NJ Career Navigator",
          url: "/navigator",
          description: "Get personalized career change recommendations",
        },
        {
          icon: "MapTrifold",
          sectionIcon: "explore",
          copy: "NJ Career Pathways",
          url: "/career-pathways",
          description: "Explore in-demand jobs and training opportunities.",
        },
      ],
    },
    {
      copy: "Find Support and Assistance",
      sectionId: "support",
      theme: "navy",
      heading: "All Support and Assistance Resources",
      cards: [
        {
          sectionIcon: "support",
          copy: "Browse Support by Category",
          url: "/support-resources",
        },
        {
          sectionIcon: "support",
          copy: "Career Support",
          url: "/support-resources/career-support",
          description:
            "Career Guidance, Job Search Help, and Re-entering the Workforce",
        },
        {
          sectionIcon: "support",
          copy: "Tuition Assistance",
          url: "/support-resources/tuition-assistance",
          description: "Job Training, Community College, and More",
        },
        {
          sectionIcon: "support",
          copy: "Other Assistance",
          url: "/support-resources/other",
          description: "Housing, Transportation, Healthcare, and More",
        },
        {
          sectionIcon: "support",
          copy: "Frequently Asked Questions",
          url: "/faq",
        },
      ],
    },
  ],
};
