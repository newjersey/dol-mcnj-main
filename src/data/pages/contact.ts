import { PageHeroProps } from "@components/blocks/PageHero";
import { HeadingLevel } from "@utils/types";

export const CONTACT_PAGE_DATA = {
  seo: {
    title: `Contact Us | ${process.env.REACT_APP_SITE_NAME}`,
  },
  en: {
    pageHero: {
      heading: "Contact Us",
      theme: "blue",
      subheading: "Need help with My Career NJ? Reach out today",
    } as PageHeroProps,
    copyBox: {
      heading: "Contact Information",
      headingLevel: 2 as HeadingLevel,
      copy: `**NJ Department of Labor and Workforce Development**<br />
      Center for Occupational Employment Information (COEI)<br />
      PO Box 057, 5th Floor, Trenton, New Jersey 08625-0057`,
    },
  },
  es: {
    pageHero: {
      heading: "Contáctanos",
      theme: "blue",
      subheading: "¿Necesitas ayuda con Mi Carrera NJ? Comunícate hoy mismo",
    } as PageHeroProps,
    copyBox: {
      heading: "Información de Contacto",
      headingLevel: 2 as HeadingLevel,
      copy: `**Departamento de Trabajo y Desarrollo Laboral de NJ**<br />
      Centro de Información sobre Empleo Ocupacional (COEI)<br />
      PO Box 057, 5to Piso, Trenton, Nueva Jersey 08625-0057`,
    },
  },
};
