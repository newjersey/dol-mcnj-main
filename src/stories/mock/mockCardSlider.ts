import { IconNames } from "@utils/enums";
import { SectionIcons, ThemeColors } from "@utils/types";

export const mockCardSlider = {
  heading: "All Job Search Tools",
  theme: "blue",
  sectionId: "jobs",
  cards: [
    {
      sys: {
        id: "3AmMT5psdguST2Rrsok5R5",
      },
      sectionIcon: "jobs" as SectionIcons,
      icon: "" as IconNames,
      copy: "Career One-Stop Job Board",
      url: "https://www.careeronestop.org",
      description: "Search for current job openings in New Jersey",
    },
    {
      sys: {
        id: "4HeyegJGi8NXaDvUCtKKUa",
      },
      sectionIcon: "jobs" as SectionIcons,
      icon: "" as IconNames,
      copy: " In-demand Occupations List",
      url: "/in-demand-occupations",
      description: "See careers with openings now and in the future in NJ",
    },
    {
      sys: {
        id: "4FzcfTXyculFqFlnWgcdo9",
      },
      sectionIcon: "jobs" as SectionIcons,
      icon: "" as IconNames,
      copy: "Labor Market Information",
      url: "https://www.nj.gov/labor/labormarketinformation/",
      description: "Learn about the labor market in NJ",
    },
    {
      sys: {
        id: "7eLHEa4Hr7d1Fv09qp7c5Y",
      },
      sectionIcon: "jobs" as SectionIcons,
      icon: "" as IconNames,
      copy: "Apprenticeship Programs",
      url: "https://www.nj.gov/labor/career-services/apprenticeship/",
      description: "Learn about apprenticeship opportunities",
    },
  ],
};
