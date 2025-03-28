import { HeadingLevel } from "@utils/types";

export const IN_DEMAND_OCCUPATIONS_PAGE_DATA = {
  seo: {
    title: `In-Demand Occupations | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      "This is a list of occupations expected to have the most openings in the future in the State of New Jersey. Trainings related to careers on this list can be eligible for funding by the state. Some occupations qualify for local and region waivers and are noted below.",
  },
  en: {
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
  },
  es: {
    hero: {
      breadcrumbs: {
        pageTitle: "Ocupaciones en Demanda",
        crumbs: [
          {
            copy: "Inicio",
            url: "/es",
          },
        ],
      },
      heading: {
        children: "Lista de Ocupaciones en Demanda",
        level: 1 as HeadingLevel,
      },
      message:
        "Esta es una lista de ocupaciones que se espera tengan la mayor cantidad de oportunidades en el futuro en el estado de Nueva Jersey. Las capacitaciones relacionadas con carreras en esta lista pueden ser elegibles para financiamiento estatal. Algunas ocupaciones califican para exenciones locales y regionales, las cuales se indican a continuación.",
    },
  },
};
