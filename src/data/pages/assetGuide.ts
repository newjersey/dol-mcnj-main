import { PageHeroProps } from "@components/blocks/PageHero";
import { ButtonProps } from "@utils/types";
import TempImage from "@images/placeholder.png";
import { ImageProps } from "next/image";

export const ASSETGUIDE_PAGE_DATA = {
  seo: {
    title: `Media and Press | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      "Find the latest news, press releases, and media resources about My Career NJ and its initiatives.",
    keywords: [
      "Career",
      "Job",
      "Training",
      "New Jersey",
      "Career Navigator",
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
  en: {
    pageHero: {
      heading: "Media and Press",
      subheading: "Welcome to the media resource page for My Career NJ",
      theme: "blue",
    } as PageHeroProps,
    tocLabel: "On this page",
    cardRow: {
      heading: "Media",
      description: "Check out the spots filmed for My Career NJ.",
      cards: [
        {
          title: "My Career NJ commercial: 30s spot",
          image: {
            src: TempImage.src,
            width: TempImage.width,
            height: TempImage.height,
            alt: "Placeholder image",
            blurDataURL: TempImage.blurDataURL,
          } as ImageProps,
          button: {
            label: "Watch the video",
            link: "https://www.youtube.com/watch?v=oU2h7URAjt8",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          title: "My Career NJ: Kingsley's Testimonial",
          image: {
            src: TempImage.src,
            width: TempImage.width,
            height: TempImage.height,
            alt: "Placeholder image",
            blurDataURL: TempImage.blurDataURL,
          } as ImageProps,
          button: {
            label: "Watch the video",
            link: "https://www.youtube.com/watch?v=Woz_fpNQQ9o",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          title: "My Career NJ: Desiree's Testimonial",
          image: {
            src: TempImage.src,
            width: TempImage.width,
            height: TempImage.height,
            alt: "Placeholder image",
            blurDataURL: TempImage.blurDataURL,
          } as ImageProps,
          button: {
            label: "Watch the video",
            link: "https://www.youtube.com/watch?v=gwo4yGllPtk",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
      ],
    },
    cardRow2: {
      heading: "In the press",
      description: "Check out My Career NJ in the press.",
      cards: [
        {
          title:
            "My Career NJ launched to connect job seekers with in-demand job training and rewarding careers",
          description: "ROI-NJ Staff (New Jersey ) - March 15, 2024",
          button: {
            label: "View article",
            link: "https://www.roi-nj.com/2024/03/15/industry/my-career-nj-launched-to-connect-job-seekers-with-in-demand-job-training-and-rewarding-careers/",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          title:
            "New Jersey is turning to AI to improve the job search process",
          description: "Fast Company - April 11, 2024",
          button: {
            label: "View article",
            link: "https://www.fastcompany.com/91090516/new-jersey-ai-to-improve-job-search",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
      ],
    },
    referenceRow: {
      heading: "How to reference My Career NJ",
      description:
        "Use this section to download our logo and properly reference the site colors in marketing materials.",
      logoCard: {
        title: "Logos",
        description: "Download the My Career NJ logo.",
      },
      colorCard: {
        title: "Colors",
        description: `Primary Blue:  #005EA2  \nSecondary Green: #008817  \nTertiary Purple: #676CC8`,
      },
    },
    contactSection: {
      heading: "Contact",
      description:
        'If you are a member of the media and need assistance, please reach out to us at [MyCareerNJ@dol.nj.gov](mailto:MyCareerNJ@dol.nj.gov). Please include "Press inquiry" in the subject line.',
    },
  },
  es: {
    pageHero: {
      heading: "Medios y Prensa",
      subheading:
        "Bienvenido a la página de recursos para medios de My Career NJ",
      theme: "blue",
    } as PageHeroProps,
    tocLabel: "En esta página",
    cardRow: {
      heading: "Medios",
      description: "Mira los anuncios filmados para My Career NJ.",
      cards: [
        {
          title: "Comercial de My Career NJ: anuncio de 30 segundos",
          image: {
            src: TempImage.src,
            width: TempImage.width,
            height: TempImage.height,
            alt: "Placeholder image",
            blurDataURL: TempImage.blurDataURL,
          } as ImageProps,
          button: {
            label: "Ver el video",
            link: "https://www.youtube.com/watch?v=oU2h7URAjt8",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          title: "My Career NJ: Testimonio de Kingsley",
          image: {
            src: TempImage.src,
            width: TempImage.width,
            height: TempImage.height,
            alt: "Placeholder image",
            blurDataURL: TempImage.blurDataURL,
          } as ImageProps,
          button: {
            label: "Ver el video",
            link: "https://www.youtube.com/watch?v=Woz_fpNQQ9o",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          title: "My Career NJ: Testimonio de Desiree",
          image: {
            src: TempImage.src,
            width: TempImage.width,
            height: TempImage.height,
            alt: "Placeholder image",
            blurDataURL: TempImage.blurDataURL,
          } as ImageProps,
          button: {
            label: "Ver el video",
            link: "https://www.youtube.com/watch?v=gwo4yGllPtk",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
      ],
    },
    cardRow2: {
      heading: "En la prensa",
      description: "Mira a My Career NJ en la prensa.",
      cards: [
        {
          title:
            "My Career NJ se lanzó para conectar a los buscadores de empleo con capacitación laboral y carreras gratificantes en demanda",
          description: "ROI-NJ Staff (New Jersey ) - March 15, 2024",
          button: {
            label: "Ver artículo",
            link: "https://www.roi-nj.com/2024/03/15/industry/my-career-nj-launched-to-connect-job-seekers-with-in-demand-job-training-and-rewarding-careers/",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          title:
            "New Jersey está recurriendo a la IA para mejorar el proceso de búsqueda de empleo",
          description: "Fast Company - April 11, 2024",
          button: {
            label: "Ver artículo",
            link: "https://www.fastcompany.com/91090516/new-jersey-ai-to-improve-job-search",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
      ],
    },
    referenceRow: {
      heading: "Cómo referenciar My Career NJ",
      description:
        "Utilice esta sección para descargar nuestro logotipo y hacer referencia correctamente a los colores del sitio en materiales de marketing.",
      logoCard: {
        title: "Logotipos",
        description: "Descargue el logotipo de My Career NJ.",
      },
      colorCard: {
        title: "Colores",
        description: `Azul Primario:  #005EA2\nVerde Secundario: #008817\nPúrpura Terciario: #676CC8`,
      },
    },
    contactSection: {
      heading: "Contacto",
      description:
        'Si usted es un miembro de los medios y necesita asistencia, por favor contáctenos en [MyCareerNJ@dol.nj.gov](mailto:MyCareerNJ@dol.nj.gov). Por favor incluya "Consulta de prensa" en la línea de asunto.',
    },
  },
};
