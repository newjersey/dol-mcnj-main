import manufacturingImage from "../images/welder.jpg";
import healthcareImage from "../images/medical.jpg";
import tdlImage from "../images/mechanic.jpg";
import { SelectorProps } from "../svg/Selector";

export const content = {
  banner: {
    title: "Welcome to New Jersey Career Pathways!",
    description:
      "With New Jersey Career Pathways, exploring in-demand jobs and training opportunities has never been easier.",
  },
  betaToolTip:
    "Our team is currently researching and developing more pathways. Check back regularly for updates.",
  industrySelector: {
    heading: "Choose an industry below to start exploring.",
    items: [
      {
        image: manufacturingImage,
        title: "Manufacturing",
        slug: "manufacturing",
        active: true,
        description:
          "Explore career pathways in the field of Manufacturing in the state of New Jersey.",
        drawerCards: [
          {
            icon: "manufacturing" as SelectorProps["name"],
            title: "Why to consider a Manufacturing Career",
            copy: "### Growth potential\n\nA lot of manufacturing companies offer on-site job training, so there is always room to grow and advance your career.\n\n### Cutting edge\n\nInnovative new technologies like robotics, wearables, 3D printing, and drones get developed and used in manufacturing.\n\n### Gratifying\n\nYou can actually see the outcome of your work in a tangible object. People who work in the field can say, “I made that.”",
          },
          {
            title: "Top Manufacturing Sectors",
            copy: "### Food\n\nFood manufacturers pick New Jersey because the state is at the center of one of the nation’s largest metropolitan areas. And so, food produced in New Jersey easily reaches millions of people. Our state is home to some of the world’s leading food brands like Campbells Soup, Mars Bars, M&Ms, and Nabisco – all made right here in the state. New and upcoming brands like Oatly and Bai started here too\n\n### Pharmaceuticals\n\nNew Jersey is known as “The Medicine Chest of the World” because of its importance to the global pharmaceutical industry. Novartis, Merck & Co., Johnson & Johnson, Bristol-Myers Squibb, Novo Nordisk, and Bayer Healthcare are among the state’s leading firms in the industry. Pharmaceutical companies are in New Jersey because the state has a highly educated workforce, including scientists.### Fabricated Metals\n\nMetal manufacturers transform metals into parts that are used in airplanes, bridges, buildings, computers, machinery, ships, power generation, and more.  Companies in this industry forge, stamp, bend, weld, shape, and machine metals. Nowadays, metal manufacturers achieve a level of precision that was undreamed of just 20 years ago to do things like lathing, 3-D printing, plasma cutting, and milling using computer numerical control (CNC) devices.",
          },
        ],
      },
      {
        image: healthcareImage,
        title: "Healthcare",
        slug: "healthcare",
        active: false,
        description:
          "Pathways for this sector are in development but you can still explore the most in-demand healthcare occupations.",
        drawerCards: [],
      },
      {
        image: tdlImage,
        title: "Transportation, Distribution, and Logistics",
        shorthandTitle: "TDL",
        slug: "tdl",
        active: false,
        description:
          "Pathways for this sector are in development but you can still explore the most in-demand TDL occupations.",
        drawerCards: [],
      },
    ],
  },
  markdownSection: `## Career Pathways and Industry Sectors—what’s the difference, exactly?\n\n### Think of Career Pathways as a GPS.\n\nCareer Pathways offers the best route to reach your career destination, outlining the steps you need to take to get where you want to go, including education, training, and upskilling.\n\n### Think of Industry Sector Information as a guidebook.\n\nIndustry Sector Information provides an overview of various industries, including a snapshot of the job market. Here’s some of the helpful information you’ll find:\n\n- Types of jobs\n- Salary expectations\n- Specific skills in high demand\n- Companies that are the major players\n- Potential for Industry growth\n\n## It’s important to make informed choices. See how Career Pathways and Industry Sector Information can help.\n\nThrough Career Pathways and Industry Sector Information, you’ll be able to make impactful, data-driven decisions. For instance, if you choose to explore the Manufacturing Career Pathway, you’ll discover:\n- Information about the most in-demand manufacturing jobs in New Jersey\n- Insights from over 40 manufacturing companies throughout New Jersey\n- Valuable data about available jobs\n- The skills, education, and experience you need to get started.\n\n## Our legwork can help you get a leg up in your career.\n\nOur data comes from trusted sources with the most up-to-date information:\n\n- Experienced New Jersey labor market analysts who study job trends\n- Actual New Jersey employers\n- Recent employment and wage surveys\n\nEveryone’s career path is different. With Career Pathways and Industry Sector Information, you’ll have what you need to help you move forward successfully.`,
  cta: {
    heading: "Still have a question about My Career NJ?",
    button: {
      text: "Contact Us",
      url: "/contact",
    },
  },
};
