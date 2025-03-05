import { CtaBannerProps } from "@components/blocks/CtaBanner";
import { SectionHeadingProps } from "@components/modules/SectionHeading";
import { FaqItem } from "@utils/types";
import { TrainingExplorerHeadingProps } from "app/(main)/training/TrainingExplorerHeading";

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
    banner: {
      heading: "NJ Training Explorer",
      subheading: "Find classes to help you qualify for in-demand jobs.",
      message:
        "Imagine having a personal guide to help you choose the best training for your future. New Jersey Training Explorer makes it easy to find the classes and skills training programs you need. Check out the catalog of vetted schools and courses that will boost your skills—so you'll be ready to take on new career opportunities.",
      steps: [
        "Search by occupation, provider, and more",
        "Filter and compare results",
        "Visit training provider's website to enroll",
      ],
      breadcrumbs: [
        {
          copy: "Home",
          url: "/",
        },
      ],
      learnMore: {
        copy: "Trainings and programs on the Training Explorer are accredited.",
        url: "/faq#etpl-program-general-information",
      },
      notReady: {
        copy: "Not ready to search for training yet?",
        buttons: [
          {
            label: "Search for jobs",
            type: "link",
            outlined: true,
            link: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=25&source=NLX&curPage=1&referer=%2FToolkit%2FJobs%2Ffind-jobs.aspx",
            iconSuffix: "ArrowSquareOut",
          },
          {
            label: "Find out about tuition resources",
            defaultStyle: "secondary",
            type: "link",
            outlined: true,
            link: "/support-resources/tuition-assistance",
            iconSuffix: "ArrowRight",
          },
        ],
      },
    } as TrainingExplorerHeadingProps,
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
    banner: {
      heading: "Explorador de Capacitación de NJ",
      subheading:
        "Encuentra clases para ayudarte a calificar para trabajos en demanda.",
      message:
        "Imagina tener un guía personal que te ayude a elegir la mejor capacitación para tu futuro. El Explorador de Capacitación de Nueva Jersey facilita la búsqueda de clases y programas de formación en habilidades que necesitas. Explora el catálogo de escuelas y cursos verificados que mejorarán tus habilidades, para que estés listo para aprovechar nuevas oportunidades profesionales.",
      steps: [
        "Busca por ocupación, proveedor y más",
        "Filtra y compara resultados",
        "Visita el sitio web del proveedor de capacitación para inscribirte",
      ],
      breadcrumbs: [
        {
          copy: "Inicio",
          url: "/es/",
        },
      ],
      learnMore: {
        copy: "Las capacitaciones y programas en el Explorador de Capacitación están acreditados.",
        url: "/es/faq#etpl-program-general-information",
      },
      notReady: {
        copy: "¿Aún no estás listo para buscar capacitación?",
        buttons: [
          {
            label: "Buscar empleos",
            type: "link",
            outlined: true,
            link: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=25&source=NLX&curPage=1&referer=%2FToolkit%2FJobs%2Ffind-jobs.aspx",
            iconSuffix: "ArrowSquareOut",
          },
          {
            label: "Conoce los recursos de matrícula",
            defaultStyle: "secondary",
            type: "link",
            outlined: true,
            link: "/es/support-resources/tuition-assistance",
            iconSuffix: "ArrowRight",
          },
        ],
      },
    } as TrainingExplorerHeadingProps,
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
          link: "/es/training-provider-resources",
          label: "Recursos para proveedores de capacitación",
          svgName: "SupportBold",
          type: "link",
          highlight: "navy",
        },
        {
          link: "/es/support-resources/tuition-assistance",
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
            url: "/es/faq",
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
