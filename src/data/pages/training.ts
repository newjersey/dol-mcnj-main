import { CtaBannerProps } from "@components/blocks/CtaBanner";
import { SectionHeadingProps } from "@components/modules/SectionHeading";
import { ButtonProps, FaqItem } from "@utils/types";
import { TrainingExplorerHeadingProps } from "app/training/TrainingExplorerHeading";
import image from "@images/placeholder.png";
import { PageHeroProps } from "@components/blocks/PageHero";

export const TRAINING_EXPLORER_PAGE_DATA = {
  seo: {
    title: `NJ Training Explorer | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      "Explore training programs and find the best fit for you with NJ Training Explorer, supported by the NJ Department of Labor. Start your search now!",
    keywords: [
      "New Jersey",
      "Training Explorer",
      "ETPL",
      "Eligible Training Provider List",
      "Job Training",
      "Training Program",
      "Training Provider",
      "In-demand Occupation",
      "Occupation",
      "My Career NJ",
      "New Jersey Job Training",
      "NJ Training Programs",
      "NJ Training Provider List",
      "NJ In-demand Occupations",
      "NJ Career Training",
      "Training Programs in New Jersey",
      "NJ Training Resources",
      "Career Training NJ",
      "NJ Skill Development",
      "New Jersey Workforce Training",
      "NJ Department of Labor Training",
      "Find Training NJ",
      "Accredited Training Programs NJ",
      "NJ Job Skills Training",
      "New Jersey Training Courses",
      "NJ Employment Training",
      "Vocational Training NJ",
      "NJ Workforce Development",
      "Professional Training NJ",
    ],
  },
  en: {
    pageHero: {
      heading: "NJ Training Explorer",
      subheading: "Find approved job training programs.",
      description:
        "Search and compare New Jersey’s approved training providers and programs. Review details and costs, gain new skills, and advance your career with confidence.",
      theme: "green",
      image: {
        src: image.src,
        width: image.width,
        height: image.height,
        blurDataURL: image.blurDataURL,
        placeholder: "blur",
        alt: "Training Hero",
      },
    } as PageHeroProps,
    steps: [
      "Search by occupation, provider, and more",
      "Filter and compare results",
      "Visit training provider's website to enroll",
    ],
    search: {
      heading: {
        level: 2,
        heading: "Search for training",
      },
      toolTip: {
        copy: "Search by training, provider, certification, SOC code, CIP code, or keyword.",
        screenReader: "Information",
      },
      clearButton: {
        label: "Clear All",
        type: "button",
        className: "clear-all",
        unstyled: true,
      },
      form: {
        inputLabel: "Search for Training",
        filterHeading: "Filters",
        miles: {
          label: "Miles from Zip Code",
          milesPlaceholder: "Miles",
          zipPlaceholder: "ZIP Code",
          zipError: "Please enter a 5-digit New Jersey ZIP code.",
        },
        costLabel: "Max Cost",
        format: {
          label: "Class Format",
          inPersonLabel: "In-Person",
          onlineLabel: "Online",
        },
        submitLabel: "Search",
      },
    } as TrainingExplorerHeadingProps["search"],
    learnMore: {
      copy: "Trainings and programs on the Training Explorer are accredited.",
      url: "/faq#etpl-program-general-information",
    },
    notReadyCta: {
      copy: "Not ready to search for training yet?",
      theme: "blue",
      buttons: [
        {
          label: "Search for jobs",
          type: "link",
          defaultStyle: "primary",
          outlined: true,
          link: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=25&source=NLX&curPage=1&referer=%2FToolkit%2FJobs%2Ffind-jobs.aspx",
        },
        {
          label: "Find out about tuition resources",
          defaultStyle: "secondary",
          type: "link",
          outlined: true,
          link: "/support-resources/tuition-assistance",
          iconSuffix: "ArrowRight",
        },
      ] as ButtonProps[],
    },
    demoVideoUrl:
      "https://www.youtube.com/embed/fSBbrIoQAFE?si=MmBcyHbiB5PjZrxR",
    iconCards: [
      {
        heading: "Search",
        description:
          "Enter information and search a vetted list of over 4000 training programs.",
        icon: "Binoculars",
      },
      {
        heading: "Compare",
        description:
          "Filter and compare programs to identify the best fit for you. ",
        icon: "Shapes",
      },
      {
        heading: "Connect",
        description:
          "Contact programs to set up a visit and learn how to apply.",
        icon: "PhoneCall",
      },
    ],
    resourceHeading: "Check out these other useful resources",
    interruptor: {
      fullColor: true,
      theme: "navy",
      heading: "Check out these other useful resources",
      customLinks: [
        {
          link: "/training-provider-resources",
          label: "Training Provider Resources",
          svgName: "SupportBold",
          type: "link",
          highlight: "navy",
        },
        {
          link: "/support-resources/tuition-assistance",
          label: "Tuition Assistance Information",
          svgName: "SupportBold",
          type: "link",
          highlight: "navy",
        },
      ],
    } as CtaBannerProps,

    footerCta: {
      inlineButtons: true,
      heading: "Have a question about the Training Explorer? ",
      items: [
        {
          copy: "Contact Us",
          url: "https://mycareer.nj.gov/contact",
        },
      ],
    },
    faqs: {
      heading: {
        headingLevel: 3,
        heading: "Frequently Asked Questions",
      } as SectionHeadingProps,
      cta: {
        heading: "Don't see your question?",
        inlineButtons: true,
        items: [
          {
            copy: "See all FAQs",
            url: "/faq",
          },
        ],
      },
      items: [
        {
          question: "How do I search for trainings on this site?",
          answer: `You can watch this video or read instructions on this page for detailed instructions on how to use the search on this site.`,
        },
        {
          question: "How can I enroll in trainings I find on this site?",
          answer: `For questions regarding a specific program or to enroll in a specific program, you must contact the school or organization directly. Contact information for each program is available under the "provider details" box within each program listing. This website is for information purposes only.\n\nIf you are interested in financial aid for tuition assistance, we'd advise you to check with your local one-stop before registering.\n\nTrainings that lead to employment in an in-demand occupation may be eligible for tuition assistance. Contact your NJ County One-Stop Career Center for more for more information about eligibility. Connect with a One-Stop Career Center by [making an appointment](https://forms.office.com/Pages/ResponsePage.aspx?id=0cN2UAI4n0uzauCkG9ZCpyMAsRmL_iZGuS3yTOduNF1UMFE1VUIxTU9MTDdXSDZNWlBHU0s4S0lQNSQlQCN0PWcu) or visiting [your local center](https://www.nj.gov/labor/career-services/contact-us/one-stops/index.shtml).`,
        },
        {
          question: "How does tuition assistance work?",
          answer: `Different tuition assistance opportunities have different requirements. Visit our [tuition assistance](https://training.njcareers.org/tuition-assistance) page to find out more about how funding works.`,
        },
      ] as FaqItem[],
    },
  },
  es: {
    pageHero: {
      heading: "Explorador de Capacitación de NJ",
      subheading: "Encuentra programas de capacitación laboral aprobados.",
      description:
        "Busca y compara proveedores y programas de capacitación aprobados en Nueva Jersey. Revisa detalles y costos, adquiere nuevas habilidades y avanza en tu carrera con confianza.",
      theme: "green",
      image: {
        src: image.src,
        width: image.width,
        height: image.height,
        blurDataURL: image.blurDataURL,
        placeholder: "blur",
        alt: "Héroe de Capacitación",
      },
    } as PageHeroProps,
    steps: [
      "Busca por ocupación, proveedor y más",
      "Filtra y compara resultados",
      "Visita el sitio web del proveedor de capacitación para inscribirte",
    ],
    breadcrumbs: [
      {
        copy: "Inicio",
        url: "/",
      },
    ],
    search: {
      heading: {
        level: 2,
        heading: "Buscar capacitación",
      },
      toolTip: {
        copy: "Buscar por capacitación, proveedor, certificación, código SOC, código CIP o palabra clave.",
        screenReader: "Información",
      },
      clearButton: {
        label: "Borrar Todo",
        type: "button",
        className: "clear-all",
        unstyled: true,
      },
      form: {
        inputLabel: "Buscar capacitación",
        filterHeading: "Filtros",
        miles: {
          label: "Millas desde el código postal",
          milesPlaceholder: "Millas",
          zipPlaceholder: "Código Postal",
          zipError:
            "Por favor, ingrese un código postal de Nueva Jersey de 5 dígitos.",
        },
        costLabel: "Costo Máximo",
        format: {
          label: "Formato de Clase",
          inPersonLabel: "Presencial",
          onlineLabel: "En Línea",
        },
        submitLabel: "Buscar",
      },
    } as TrainingExplorerHeadingProps["search"],
    learnMore: {
      copy: "Las capacitaciones y programas en el Explorador de Capacitación están acreditados.",
      url: "/faq#etpl-program-general-information",
    },
    notReadyCta: {
      copy: "¿Aún no estás listo para buscar capacitación?",
      buttons: [
        {
          label: "Buscar empleos",
          type: "link",
          defaultStyle: "primary",
          outlined: true,
          link: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=25&source=NLX&curPage=1&referer=%2FToolkit%2FJobs%2Ffind-jobs.aspx",
          iconSuffix: "ArrowSquareOut",
        },
        {
          label: "Conoce los recursos de matrícula",
          defaultStyle: "secondary",
          type: "link",
          outlined: true,
          link: "/support-resources/tuition-assistance",
          iconSuffix: "ArrowRight",
        },
      ] as ButtonProps[],
    },
    demoVideoUrl:
      "https://www.youtube.com/embed/fSBbrIoQAFE?si=MmBcyHbiB5PjZrxR",
    iconCards: [
      {
        heading: "Buscar",
        description:
          "Ingresa información y busca en una lista verificada de más de 4000 programas de capacitación.",
        icon: "Binoculars",
      },
      {
        heading: "Comparar",
        description:
          "Filtra y compara programas para identificar el que mejor se adapte a ti.",
        icon: "Shapes",
      },
      {
        heading: "Conectar",
        description:
          "Contacta programas para programar una visita y aprender cómo inscribirte.",
        icon: "PhoneCall",
      },
    ],
    resourceHeading: "Consulta estos otros recursos útiles",
    interruptor: {
      fullColor: true,
      theme: "navy",
      heading: "Consulta estos otros recursos útiles",
      customLinks: [
        {
          link: "/training-provider-resources",
          label: "Recursos para proveedores de capacitación",
          svgName: "SupportBold",
          type: "link",
          highlight: "navy",
        },
        {
          link: "/support-resources/tuition-assistance",
          label: "Información sobre asistencia de matrícula",
          svgName: "SupportBold",
          type: "link",
          highlight: "navy",
        },
      ],
    } as CtaBannerProps,

    footerCta: {
      inlineButtons: true,
      heading: "¿Tienes una pregunta sobre el Explorador de Capacitación?",
      items: [
        {
          copy: "Contáctanos",
          url: "https://mycareer.nj.gov/contact",
        },
      ],
    },
    faqs: {
      heading: {
        headingLevel: 3,
        heading: "Preguntas Frecuentes",
      } as SectionHeadingProps,
      cta: {
        heading: "¿No ves tu pregunta?",
        inlineButtons: true,
        items: [
          {
            copy: "Ver todas las preguntas frecuentes",
            url: "/faq",
          },
        ],
      },
      items: [
        {
          question: "¿Cómo busco capacitaciones en este sitio?",
          answer: `Puedes ver este video o leer las instrucciones en esta página para obtener detalles sobre cómo usar la búsqueda en este sitio.`,
        },
        {
          question:
            "¿Cómo puedo inscribirme en capacitaciones que encuentro en este sitio?",
          answer: `Para preguntas sobre un programa específico o para inscribirte, debes contactar directamente con la escuela u organización. La información de contacto de cada programa está disponible en la sección "detalles del proveedor" dentro de cada listado. Este sitio web es solo para propósitos informativos.\n\nSi estás interesado en ayuda financiera para asistencia de matrícula, te recomendamos consultar con tu centro de empleo local antes de registrarte.\n\nLas capacitaciones que conducen a empleos en ocupaciones en demanda pueden ser elegibles para asistencia de matrícula. Contacta con el Centro de Empleo One-Stop de tu condado en Nueva Jersey para más información sobre elegibilidad. Conéctate con un Centro de Empleo One-Stop [agendando una cita](https://forms.office.com/Pages/ResponsePage.aspx?id=0cN2UAI4n0uzauCkG9ZCpyMAsRmL_iZGuS3yTOduNF1UMFE1VUIxTU9MTDdXSDZNWlBHU0s4S0lQNSQlQCN0PWcu) o visitando [tu centro local](https://www.nj.gov/labor/career-services/contact-us/one-stops/index.shtml).`,
        },
        {
          question: "¿Cómo funciona la asistencia de matrícula?",
          answer: `Las oportunidades de asistencia de matrícula tienen diferentes requisitos. Visita nuestra página de [asistencia de matrícula](https://training.njcareers.org/tuition-assistance) para obtener más información sobre cómo funciona el financiamiento.`,
        },
      ] as FaqItem[],
    },
  },
};
