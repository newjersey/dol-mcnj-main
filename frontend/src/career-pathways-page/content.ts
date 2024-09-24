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
        drawerDescription:
          "Everything that doesn’t exist in nature has to be manufactured, such as candy bars, apparel and shoes, airplanes, and wind turbines. Simply put, manufacturing means “making things.”",
        drawerCards: [
          {
            icon: "manufacturing" as SelectorProps["name"],
            title: "Why to consider a Manufacturing Career",
            copy: "### Growth potential\n\nA lot of manufacturing companies offer on-site job training, so there is always room to grow and advance your career.\n\n### Cutting edge\n\nInnovative new technologies like robotics, wearables, 3D printing, and drones get developed and used in manufacturing.\n\n### Gratifying\n\nYou can actually see the outcome of your work in a tangible object. People who work in the field can say, “I made that.”",
          },
          {
            title: "Top Manufacturing Sectors",
            copy: "### Food\n\nFood manufacturers pick New Jersey because the state is at the center of one of the nation’s largest metropolitan areas. And so, food produced in New Jersey easily reaches millions of people. Our state is home to some of the world’s leading food brands like Campbells Soup, Mars Bars, M&Ms, and Nabisco – all made right here in the state. New and upcoming brands like Oatly and Bai started here too\n\n### Pharmaceuticals\n\nNew Jersey is known as “The Medicine Chest of the World” because of its importance to the global pharmaceutical industry. Novartis, Merck & Co., Johnson & Johnson, Bristol-Myers Squibb, Novo Nordisk, and Bayer Healthcare are among the state’s leading firms in the industry. Pharmaceutical companies are in New Jersey because the state has a highly educated workforce, including scientists.\n\n### Fabricated Metals\n\nMetal manufacturers transform metals into parts that are used in airplanes, bridges, buildings, computers, machinery, ships, power generation, and more.  Companies in this industry forge, stamp, bend, weld, shape, and machine metals. Nowadays, metal manufacturers achieve a level of precision that was undreamed of just 20 years ago to do things like lathing, 3-D printing, plasma cutting, and milling using computer numerical control (CNC) devices.",
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
        drawerDescription:
          "Promote and maintain the well-being of your community — discover your next career move in healthcare. The jobs below represent the latest in-demand healthcare positions in the state of New Jersey. Anyone interested in a career in healthcare is required to pass a background check to keep patients safe.",
        drawerCards: [
          {
            icon: "healthcare" as SelectorProps["name"],
            title: "Why to consider a Healthcare Career",
            copy: "### Job Security\n\nHealthcare is one of the fastest growing and most stable industries to work in. Health care is the only industry that has added jobs in the state every year from 1990 through 2019, even in times of recessions.\n\n### Educational Options\n\nThere are jobs for people at all education levels.\n\n### Well Paid Meaningful Work\n\nYou can make a meaningful difference in people’s lives while earning a living.",
          },
          {
            title: "Top Healthcare Sectors",
            copy: "Pellentesque porta quis dolor non mattis. Donec in neque vitae eros vehicula elementum. Aliquam erat volutpat. Nulla nibh nisi, bibendum vitae libero maximus, suscipit tincidunt magna. Proin vestibulum orci at sapien ullamcorper congue. Aliquam vel nulla sollicitudin augue eleifend scelerisque eget ut velit. Nunc non est ultrices, efficitur erat eget, lobortis tortor. Aliquam erat volutpat. Donec sollicitudin lorem urna, vitae sodales massa facilisis eu. Aenean hendrerit, nunc sed interdum semper, arcu tellus ultricies nulla, vel viverra quam ipsum id libero. Suspendisse pulvinar dignissim odio eget sagittis.",
          },
        ],
      },
      {
        image: tdlImage,
        title: "Transportation, Distribution, and Logistics",
        shorthandTitle: "TDL",
        slug: "tdl",
        active: false,
        description:
          "Pathways for this sector are in development but you can still explore the most in-demand TDL occupations.",
        drawerDescription:
          "Be an important part of our nation’s supply chain with a career in transportation, distribution, and logistics (TDL). The diverse range of job roles and responsibilities listed below represent the latest in-demand TDL positions in the state of New Jersey.",
        drawerCards: [
          {
            icon: "manufacturing" as SelectorProps["name"],
            title: "Why to consider a TDL Career",
            copy: "### Quality Jobs\n\nMany jobs in transportation distribution and logistics offer long-term employment, and opportunities for advancement, great benefits, on the job training and mentorship.\n\n### For a variety of interests\n\nThe industry offers opportunities for people who like working with customers – flight attendants and train conductors, for example - as well as people who like to build and fix things and solve problems, like engineers, service technicians, and mechanics.\n\n### Important Contribution\n\nTransportation disctribulation and logistics are all critical to the economy and society. When you work in transportation, you can go to work every day knowing you are having an impact on people.",
          },
          {
            title: "Top Manufacturing Sectors",
            copy: "Pellentesque porta quis dolor non mattis. Donec in neque vitae eros vehicula elementum. Aliquam erat volutpat. Nulla nibh nisi, bibendum vitae libero maximus, suscipit tincidunt magna. Proin vestibulum orci at sapien ullamcorper congue. Aliquam vel nulla sollicitudin augue eleifend scelerisque eget ut velit. Nunc non est ultrices, efficitur erat eget, lobortis tortor. Aliquam erat volutpat. Donec sollicitudin lorem urna, vitae sodales massa facilisis eu. Aenean hendrerit, nunc sed interdum semper, arcu tellus ultricies nulla, vel viverra quam ipsum id libero. Suspendisse pulvinar dignissim odio eget sagittis.",
          },
        ],
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
