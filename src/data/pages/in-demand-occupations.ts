import { PageHeroProps } from "@components/blocks/PageHero";

export const IN_DEMAND_OCCUPATIONS_PAGE_DATA = {
  seo: {
    title: `In-Demand Occupations | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      "This is a list of occupations expected to have the most openings in the future in the State of New Jersey. Trainings related to careers on this list can be eligible for funding by the state. Some occupations qualify for local and region waivers and are noted below.",
  },
  en: {
    pageHero: {
      heading: "In-Demand Occupations List",
      subheading:
        "Discover New Jersey's occupations with the most projected openings",
      theme: "blue",
      infoBar: {
        text: "This is a list of job titles that are expected to have a high number of available job openings compared to qualified workers. The list is updated every two years for New Jerseyans to choose education and training paths matched to job market needs. The State only funds New Jersey residents seeking skills training for the demand occupations listed here.",
        type: "info",
      },
    } as PageHeroProps,
  },
  es: {
    pageHero: {
      heading: "Lista de Ocupaciones en Alta Demanda",
      subheading:
        "Descubre las ocupaciones con más proyecciones de vacantes en Nueva Jersey",
      theme: "blue",
      infoBar: {
        text: "Esta es una lista de títulos de trabajo que se espera tengan un alto número de vacantes disponibles en comparación con los trabajadores calificados. La lista se actualiza cada dos años para que los residentes de Nueva Jersey elijan rutas de educación y capacitación alineadas con las necesidades del mercado laboral. El Estado solo financia la capacitación laboral para residentes de Nueva Jersey en las ocupaciones en demanda que aparecen en esta lista.",
        type: "info",
      },
    } as PageHeroProps,
  },
};
