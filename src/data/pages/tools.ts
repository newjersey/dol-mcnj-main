import { ThemeColors } from "@utils/types";

export const TOOLS_PAGE_DATA = {
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
