import { ThemeColors } from "@utils/types";

export const TOOLS_PAGE_DATA = {
  seo: {
    title: `Tools and Resources | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      "Discover My Career NJ's comprehensive collection of tools and resources organized by category. Find job search tools, training resources, career exploration guides, and support services all in one place.",
    keywords: [
      "New Jersey",
      "Career Tools",
      "Job Search Tools",
      "Training Resources",
      "Career Resources",
      "Career Navigator",
      "Training Explorer",
      "Job Board",
      "Career Pathways",
      "Support Resources",
      "My Career NJ",
      "NJ Department of Labor",
      "Employment Resources",
      "Career Guidance",
      "Professional Development",
    ],
    ogImage: {
      sys: {
        id: "buiOl5KtlbWd2n75TzD61",
      },
      url: "https://images.ctfassets.net/jbdk7q9c827d/buiOl5KtlbWd2n75TzD61/8614058229c32e1d4cfe2bb035b7746c/0d4a1adf-de41-46a6-b45a-75015bf737b3.png",
      title: "My Career NJ Title Card",
      description: "My Career NJ Tools and Resources",
      width: 1200,
      height: 630,
    },
  },
  en: {
    banner: {
      heading: "Tools and Resources by Category",
      subheading: "Discover My Career NJ’s tools by category",
      theme: "blue" as ThemeColors,
    },
    toolRows: [
      {
        id: "jobs",
        heading: "All Job Search Resources and Tools",
        theme: "blue" as ThemeColors,
        mainCard: {
          title: "NJ Career Navigator",
          icon: "Compass",
          theme: "blue",
          message:
            "Upload your resume to see personalized job and training recommendations.",
          link: {
            href: "/navigator",
            copy: "Get Started",
          },
        },
        items: [
          {
            title: "One Stop Job Board",
            message: "Search for jobs",
            icon: "ArrowSquareOut",
            link: {
              href: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=",
            },
          },
          {
            title: "Labor Market Insights",
            message: "Learn about the labor market in NJ",
            icon: "ArrowSquareOut",
            link: {
              href: "https://www.nj.gov/labor/labormarketinformation/",
            },
          },
        ],
      },
      {
        id: "training",
        heading: "All Training Resources and Tools",
        theme: "green" as ThemeColors,
        mainCard: {
          title: "NJ Training Explorer",
          icon: "Signpost",
          theme: "green",
          message:
            "Search by job, training program, and more to find a training that works for you.",
          link: {
            copy: "Search Training",
            href: "/training",
          },
        },
        items: [
          {
            title: "Tuition Assistance Resources",
            message: "Learn about ways to get help paying for education",
            link: {
              href: "/support-resources/tuition-assistance",
            },
          },
          {
            title: "Training Provider Resources",
            message: "Important information for training providers.",
            link: {
              href: "/training-provider-resources",
            },
          },
        ],
      },
      {
        id: "career",
        heading: "All Career Exploration Resources and Tools",
        theme: "purple" as ThemeColors,
        mainCard: {
          title: "NJ Career Pathways",
          icon: "Path",
          theme: "purple",
          message:
            "Explore popular industries to see what it takes to enter or progress in them.",
          link: {
            copy: "Explore Pathways",
            href: "/career-pathways",
          },
        },
        items: [
          {
            title: "In-demand Occupations List",
            message: "See careers with opening now and in the future in NJ",
            link: {
              href: "/in-demand-occupations",
            },
          },
        ],
      },
      {
        id: "support",
        heading: "All Support and Assistance Resources",
        theme: "navy" as ThemeColors,
        items: [
          {
            title: "Helpful Resources",
            link: {
              href: "/support-resources",
            },
            message:
              "Career Support, Tuition Assistance, Resident Support, and More",
          },
          // {
          //   title: "Frequently Asked Questions",
          //   link: {
          //     href: "/faq",
          //   },
          //   message: "Frequently Asked Questions",
          // },
        ],
      },
    ],
  },
  es: {
    banner: {
      heading: "Herramientas y recursos por categoría",
      subheading: "Descubre las herramientas de My Career NJ por categoría",
      theme: "blue" as ThemeColors,
    },
    toolRows: [
      {
        id: "jobs",
        heading: "All Job Search Resources and Tools",
        theme: "blue" as ThemeColors,
        mainCard: {
          title: "NJ Career Navigator",
          icon: "Compass",
          theme: "blue",
          message:
            "Upload your resume to see personalized job and training recommendations.",
          link: {
            href: "/navigator",
            copy: "Get Started",
          },
        },
        items: [
          {
            title: "National Labor Exchange",
            message: "Search for jobs",
            icon: "ArrowSquareOut",
            link: {
              href: "https://www.naswa.org/partnerships/nlx",
            },
          },
          {
            title: "Labor Market Insights",
            message: "Learn about the labor market in NJ",
            icon: "ArrowSquareOut",
            link: {
              href: "https://www.nj.gov/labor/labormarketinformation/",
            },
          },
        ],
      },
      {
        id: "training",
        heading: "All Training Resources and Tools",
        theme: "green" as ThemeColors,
        mainCard: {
          title: "NJ Training Explorer",
          icon: "Signpost",
          theme: "green",
          message:
            "Search by job, training program, and more to find a training that works for you.",
          link: {
            copy: "Search Training",
            href: "/training",
          },
        },
        items: [
          {
            title: "Tuition assistance resources",
            message: "Learn about ways to get help paying for education",
            link: {
              href: "/support-resources/tuition-assistance",
            },
          },
          {
            title: "Training Provider Resources",
            message: "Important information for training providers.",
            link: {
              href: "/training-provider-resources",
            },
          },
        ],
      },
      {
        id: "career",
        heading: "All Career Exploration Resources and Tools",
        theme: "purple" as ThemeColors,
        mainCard: {
          title: "NJ Career Pathways",
          icon: "Path",
          theme: "purple",
          message:
            "Explore popular industries to see what it takes to enter or progress in them.",
          link: {
            copy: "Explore Pathways",
            href: "/career-pathways",
          },
        },
        items: [
          {
            title: "In-demand Occupations List",
            message: "See careers with opening now and in the future in NJ",
            link: {
              href: "/in-demand-occupations",
            },
          },
        ],
      },
      {
        id: "support",
        heading: "All Support and Assistance Resources",
        theme: "navy" as ThemeColors,
        items: [
          {
            title: "Helpful Resources",
            link: {
              href: "/support-resources",
            },
            message:
              "Career Support, Tuition Assistance, Resident Support, and More",
          },
          // {
          //   title: "Frequently Asked Questions",
          //   link: {
          //     href: "/faq",
          //   },
          //   message: "Frequently Asked Questions",
          // },
        ],
      },
    ],
  },
};
