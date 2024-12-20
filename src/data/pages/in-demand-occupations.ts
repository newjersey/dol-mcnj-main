import { HeadingLevel } from "@utils/types";

export const IN_DEMAND_OCCUPATIONS_PAGE_DATA = {
  seo: {
    title: `In-Demand Occupations | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      "This is a list of occupations expected to have the most openings in the future in the State of New Jersey. Trainings related to careers on this list can be eligible for funding by the state. Some occupations qualify for local and region waivers and are noted below.",
  },
  hero: {
    breadcrumbs: {
      pageTitle: "In-Demand Occupations",
      crumbs: [
        {
          copy: "Home",
          url: "/",
        },
      ],
    },
    heading: {
      children: "In-Demand Occupation List",
      level: 1 as HeadingLevel,
    },
    message:
      "This is a list of occupations expected to have the most openings in the future in the State of New Jersey. Trainings related to careers on this list can be eligible for funding by the state. Some occupations qualify for local and region waivers and are noted below.",
  },
};
