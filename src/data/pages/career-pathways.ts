import { CtaBannerProps } from "@components/blocks/CtaBanner";
import { MinimalBannerProps } from "@components/blocks/MinimalBanner";
import mechanic from "@images/mechanic.jpg";
import medical from "@images/medical.jpg";
import welder from "@images/welder.jpg";
import { IndustrySelectorProps } from "@utils/types/components";
export const CAREER_PATHWAYS_PAGE_DATA = {
  seo: {
    title: `New Jersey Career Pathways | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      "Explore popular industries and careers in the state of New Jersey.",
    keywords: [
      "New Jersey",
      "Career",
      "Job",
      "Training",
      "Career Pathways",
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
    heading: "Welcome to New Jersey Career Pathways!",
    description:
      "With New Jersey Career Pathways, exploring in-demand jobs and training opportunities has never been easier.",
    tag: {
      color: "navy",
      title: "Beta",
      tooltip:
        "Our team is currently researching and developing more pathways. Check back regularly for updates.",
      icon: "Info",
    },
    crumbs: {
      pageTitle: "NJ Career Pathways",
      items: [
        {
          copy: "Home",
          url: "/",
        },
      ],
    },
  } as MinimalBannerProps,
  industrySelector: {
    heading: "Choose an industry below to start exploring.",
    items: [
      {
        image: welder,
        title: "Manufacturing",
        slug: "manufacturing",
        active: true,
        description:
          "Explore career pathways in the field of Manufacturing in the state of New Jersey.",
        drawerDescription:
          "Everything that doesn't exist in nature has to be manufactured, such as candy bars, apparel and shoes, airplanes, and wind turbines. Simply put, manufacturing means “making things.”",
        drawerCards: [
          {
            icon: "Factory",
            title: "Why to consider a Manufacturing Career",
            copy: "### Growth potential\n\nA lot of manufacturing companies offer on-site job training, so there is always room to grow and advance your career.\n\n### Cutting edge\n\nInnovative new technologies like robotics, wearables, 3D printing, and drones get developed and used in manufacturing.\n\n### Gratifying\n\nYou can actually see the outcome of your work in a tangible object. People who work in the field can say, “I made that.”",
          },
          {
            icon: "Star",
            title: "Top Manufacturing Sectors",
            copy: "### Food\n\nFood manufacturers pick New Jersey because the state is at the center of one of the nation's largest metropolitan areas. And so, food produced in New Jersey easily reaches millions of people. Our state is home to some of the world's leading food brands like Campbells Soup, Mars Bars, M&Ms, and Nabisco – all made right here in the state. New and upcoming brands like Oatly and Bai started here too.\n\n### Pharmaceuticals\n\nNew Jersey is known as “The Medicine Chest of the World” because of its importance to the global pharmaceutical industry. Novartis, Merck & Co., Johnson & Johnson, Bristol-Myers Squibb, Novo Nordisk, and Bayer Healthcare are among the state's leading firms in the industry. Pharmaceutical companies are in New Jersey because the state has a highly educated workforce, including scientists.\n\n### Fabricated Metals\n\nMetal manufacturers transform metals into parts that are used in airplanes, bridges, buildings, computers, machinery, ships, power generation, and more. Companies in this industry forge, stamp, bend, weld, shape, and machine metals. Nowadays, metal manufacturers achieve a level of precision that was undreamed of just 20 years ago to do things like lathing, 3-D printing, plasma cutting, and milling using computer numerical control (CNC) devices.",
          },
        ],
      },
      {
        image: medical,
        title: "Healthcare",
        slug: "healthcare",
        active: false,
        description:
          "Pathways for this sector are in development but you can still explore the most in-demand healthcare occupations.",
        drawerDescription:
          "Promote and maintain the well-being of your community — discover your next career move in healthcare. The jobs below represent the latest in-demand healthcare positions in the state of New Jersey. Anyone interested in a career in healthcare is required to pass a background check to keep patients safe.",
        drawerCards: [
          {
            icon: "Stethoscope",
            title: "Why to consider a Healthcare Career",
            copy: "### Job Security\n\nHealthcare is one of the fastest growing and most stable industries to work in. Health care is the only industry that has added jobs in the state every year from 1990 through 2019, even in times of recessions.\n\n### Educational Options\n\nThere are jobs for people at all education levels.\n\n### Well Paid Meaningful Work\n\nYou can make a meaningful difference in people's lives while earning a living.",
          },
          {
            icon: "Star",
            title: "Top Healthcare Sectors",
            copy: "### Hospitals\n\nHospitals provide people with inpatient care. The most common type of hospital is a general hospital, which typically has an emergency department, operating rooms, diagnostic rooms, and rooms where patients receive treatment and recuperate. Doctors, nurses and other healthcare professionals often receive education in hospitals. Hospitals are also important places for clinical research.\n\n### Doctors' and Dentists' Offices\n\nDoctors' and dentists' offices are just two of many types of outpatient or ambulatory care settings. Other types include diagnostic laboratories, urgent care centers, same-day surgery centers, and rehabilitation centers.\n\n### Nursing and Residential Care\n\nPeople who need 24-hour supervision, but don't need to be hospitalized stay in nursing and residential care settings. The care they receive can be a mix of health and social services. Health services provided in nursing and residential care settings are often provided by skilled nurses.",
          },
        ],
      },
      {
        image: mechanic,
        title: "Transportation, Distribution, and Logistics",
        shorthandTitle: "TDL",
        slug: "tdl",
        active: false,
        description:
          "Pathways for this sector are in development but you can still explore the most in-demand TDL occupations.",
        drawerDescription:
          "Be an important part of our nation's supply chain with a career in transportation, distribution, and logistics (TDL). The diverse range of job roles and responsibilities listed below represent the latest in-demand TDL positions in the state of New Jersey.",
        drawerCards: [
          {
            icon: "Truck",
            title: "Why to consider a TDL Career",
            copy: "### Quality Jobs\n\nMany jobs in transportation distribution and logistics offer long-term employment, and opportunities for advancement, great benefits, on the job training and mentorship.\n\n### For a variety of interests\n\nThe industry offers opportunities for people who like working with customers – flight attendants and train conductors, for example - as well as people who like to build and fix things and solve problems, like engineers, service technicians, and mechanics.\n\n### Important Contribution\n\nTransportation disctribulation and logistics are all critical to the economy and society. When you work in transportation, you can go to work every day knowing you are having an impact on people.",
          },
          {
            icon: "Star",
            title: "Top Manufacturing Sectors",
            copy: "### Air Transportation\n\nAircraft are used to move passengers or cargo. They can be scheduled or on-demand and the companies that run them range in size from major airlines to regional carriers. New Jersey is home to three commercial airports – Newark Liberty, Trenton Mercer, and Atlantic City - eight airports that support corporate and private-use general aviation activities, 30 other public-use airports, one seaplane base, as well as several heliports and balloon ports.\n\n### Road Trucking\n\nTrucks play a major role in the New Jersey economy, a part of the larger freight industry. Terminals and warehousing centers connect these systems to deliver goods and also jobs. Of the more than 600 million tons of goods moved each year, 75 percent move by truck. There are rules and regulations that govern the drivers and trucks in this industry\n\n### Warehousing\n\nWarehousing is the process of storing physical inventory for sale or distribution. Warehouses are used by all different types of businesses that need to temporarily store products in bulk before either shipping them to other locations or individually to end consumers.",
          },
        ],
      },
    ],
  } as IndustrySelectorProps,
  markdownSection: `## Career Pathways and Industry Sectors—what's the difference, exactly?

  ### Think of Career Pathways as a GPS.

  Career Pathways offers the best route to reach your career destination, outlining the steps you need to take to get where you want to go, including education, training, and upskilling.

  ### Think of Industry Sector Information as a guidebook.

  Industry Sector Information provides an overview of various industries, including a snapshot of the job market. Here's some of the helpful information you'll find:

  - Types of jobs
  - Salary expectations
  - Specific skills in high demand
  - Companies that are the major players
  - Potential for Industry growth

  ## It's important to make informed choices. See how Career Pathways and Industry Sector Information can help.

  Through Career Pathways and Industry Sector Information, you'll be able to make impactful, data-driven decisions. For instance, if you choose to explore the Manufacturing Career Pathway, you'll discover:
  - Information about the most in-demand manufacturing jobs in New Jersey
  - Insights from over 40 manufacturing companies throughout New Jersey
  - Valuable data about available jobs
  - The skills, education, and experience you need to get started.

  ## Our legwork can help you get a leg up in your career.

  Our data comes from trusted sources with the most up-to-date information:

  - Experienced New Jersey labor market analysts who study job trends
  - Actual New Jersey employers
  - Recent employment and wage surveys

  Everyone's career path is different. With Career Pathways and Industry Sector Information, you'll have what you need to help you move forward successfully.`,
  ctaBanner: {
    heading: "Explore these other great tools.",
    fullColor: true,
    theme: "purple",
    headingLevel: 3,
    customLinks: [
      {
        iconPrefix: "Compass",
        link: "/navigator",
        label: "NJ Career Navigator",
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
        iconPrefix: "GraduationCap",
        link: "/training",
        label: "NJ Training Explorer",
        type: "link",
        highlight: "green",
      },
    ],
  } as CtaBannerProps,
  cta: {
    heading: "Still have a question about My Career NJ?",
    className: "light",
    items: [
      {
        copy: "Contact Us",
        url: "/contact",
      },
    ],
  } as CtaBannerProps,
};
