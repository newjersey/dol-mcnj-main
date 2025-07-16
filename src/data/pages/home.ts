import { PageBannerProps } from "@utils/types";
import scientist from "@images/scientist.png";
import welder from "@images/welder.jpg";
import training from "@images/training.png";
import { FancyBannerProps } from "@utils/types/components";

export const HOMEPAGE_DATA = {
  seo: {
    title: process.env.REACT_APP_SITE_NAME,
    pageDescription:
      "Explore My Career NJ to find job training, career resources, and employment opportunities with the New Jersey Department of Labor.",
    keywords: [
      "Career",
      "Job Training",
      "Resources",
      "Tuition Assistance",
      "Career Pathways",
      "Training Explorer",
      "New Jersey Training Explorer",
      "Career Navigator",
      "My Career NJ",
      "jobs",
      "nj jobs",
      "Career Resources NJ",
      "Job Training NJ",
      "New Jersey Career Pathways",
      "NJ Training Explorer",
      "Career Navigator NJ",
      "Tuition Assistance NJ",
      "Apprenticeship Programs NJ",
      "New Jersey Department of Labor",
      "NJ Job Search Tools",
      "In-Demand Occupations NJ",
      "Professional Development NJ",
      "Career Support NJ",
      "NJ Career Guidance",
      "Job Search Help NJ",
      "Career Services NJ",
      "NJ Workforce Development",
      "Free Online Training NJ",
      "NJ Labor Market Information",
      "Community College Assistance NJ",
      "Training Provider Resources NJ",
      "Career resources in Bergen County",
      "Job training in Passaic County",
      "Workforce development in Hudson County",
      "Employment opportunities in Essex County",
      "Career Navigator in Morris County",
      "Job assistance in Middlesex County",
      "Training programs in Somerset County",
      "Career services in Mercer County",
      "Employment support in Monmouth County",
      "Workforce development in Union County",
      "Career resources in Camden County",
      "Job training in Burlington County",
      "Workforce development in Atlantic County",
      "Employment opportunities in Gloucester County",
      "Career Navigator in Ocean County",
      "Employment services in Newark, NJ",
      "Job support in Jersey City, NJ",
      "Career training in Trenton, NJ",
      "Job assistance in Atlantic City, NJ",
      "Workforce programs in Paterson, NJ",
    ],
    ogImage: {
      url: "https://images.ctfassets.net/jbdk7q9c827d/buiOl5KtlbWd2n75TzD61/8614058229c32e1d4cfe2bb035b7746c/0d4a1adf-de41-46a6-b45a-75015bf737b3.png",
      title: "My Career NJ Title Card",
      width: 2400,
      height: 1260,
      fileName: "0d4a1adf-de41-46a6-b45a-75015bf737b3.png",
      contentType: "image/png",
    },
  },
  en: {
    banner: {
      heading: "My Career NJ",
      subHeading: "The tools you need for where you are",
      message:
        "Find the right training program, get personalized job matches, and explore New Jersey’s in demand careers with these powerful digital tools.",
      images: [
        {
          src: training.src,
          alt: "A person working on a computer in a training environment",
          width: training.width,
          height: training.height,
          blurDataURL: training.blurDataURL,
        },
        {
          src: welder.src,
          alt: "A person working on a construction site",
          width: welder.width,
          height: welder.height,
          blurDataURL: welder.blurDataURL,
        },
        {
          src: scientist.src,
          alt: "A person working in a laboratory",
          width: scientist.width,
          height: scientist.height,
          blurDataURL: scientist.blurDataURL,
        },
      ],
    } as FancyBannerProps,
    introBlocks: {
      heading:
        "No matter where you are on your career journey, My Career NJ is here to help you.",
      message:
        "Explore a connected suite of career, job, and training tools to help level up your career.",
      sections: [
        {
          link: {
            url: "/training",
            copy: "Visit the NJ Training Explorer",
          },
          title: "NJ Training Explorer",
          heading:
            "Certifications, Professional Development, Apprenticeships & More!",
          message:
            "Search by job, training program, and more to find a training that works for you. In-demand trainings may even be eligible for funding assistance. ",
        },
        {
          link: {
            url: "/navigator",
            copy: "Visit the NJ Career Navigator",
          },
          title: "NJ Career Navigator",
          heading: "Personalized Career Recommendations",
          message:
            "Get personalized, data-driven career recommendations based on your skills and experience.",
        },
        {
          link: {
            url: "/career-pathways",
            copy: "Visit the NJ Career Pathways",
          },
          title: "NJ Career Pathways",
          heading: "Explore Pathways to In-Demand Careers",
          message:
            "Uncover career opportunities and growth potential in key industries across New Jersey. From healthcare to manufacturing, Career Pathways provides the roadmap to help you navigate your journey to success.",
        },
      ],
      sectionsHeading: "How My Career NJ can help you:",
    },
    sectionHeading: {
      heading: "Explore Tools",
      strikeThrough: true,
    },
    sections: [
      {
        copy: "Find a Job",
        sectionId: "jobs",
        theme: "blue",
        heading: "All Job Search Tools",
        cards: [
          {
            copy: "NJ Career Navigator",
            url: "/navigator",
            description: "Get personalized career change recommendations",
          },
          {
            copy: " In-Demand Occupations List",
            url: "/in-demand-occupations",
            description:
              "See careers with openings now and in the future in NJ",
          },
          {
            copy: "CareerOneStop Job Board",
            url: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=25&source=NLX&curPage=1&referer=%2FToolkit%2FJobs%2Ffind-jobs.aspx",
            description: "Search for current job openings in New Jersey",
          },
          {
            copy: "Labor Market Information",
            url: "https://www.nj.gov/labor/labormarketinformation/",
            description: "Learn about the labor market in NJ",
          },
          {
            copy: "Apprenticeship Programs",
            url: "https://www.nj.gov/labor/career-services/apprenticeship/",
            description: "Learn about apprenticeship opportunities",
          },
        ],
      },
      {
        copy: "Get Training",
        sectionId: "training",
        theme: "green",
        heading: "All Training Tools",
        cards: [
          {
            sectionIcon: "training",
            copy: "NJ Training Explorer",
            url: "/training",
            description: "Search for training programs in NJ",
          },
          {
            sectionIcon: "training",
            copy: "NJ Career Navigator",
            url: "/navigator",
            description: "Get personalized career change recommendations",
          },
          {
            sectionIcon: "training",
            copy: "Tuition Assistance Resources",
            url: "/support-resources/tuition-assistance",
            description: "Learn about ways to get help paying for education",
          },
          {
            sectionIcon: "training",
            copy: "Training Provider Resources",
            url: "/training-provider-resources",
            description: "Important information for training providers",
          },
          {
            sectionIcon: "training",
            copy: "SkillUp",
            url: "https://nj.metrixlearning.com/landing.cfm",
            description: "Free on-line training videos",
          },
        ],
      },
      {
        copy: "Explore Careers",
        sectionId: "explore",
        theme: "purple",
        heading: "All Career Exploration Resources",
        cards: [
          {
            sectionIcon: "jobs",
            copy: "NJ Career Navigator",
            url: "/navigator",
            description: "Get personalized career change recommendations",
          },
          {
            icon: "MapTrifold",
            sectionIcon: "explore",
            copy: "NJ Career Pathways",
            url: "/career-pathways",
            description: "Explore in-demand jobs and training opportunities.",
          },
        ],
      },
      {
        copy: "Find Support and Assistance",
        sectionId: "support",
        theme: "navy",
        heading: "All Support and Assistance Resources",
        cards: [
          {
            sectionIcon: "support",
            copy: "Browse Support by Category",
            url: "/support-resources",
          },
          {
            sectionIcon: "support",
            copy: "Career Support",
            url: "/support-resources/career-support",
            description:
              "Career Guidance, Job Search Help, and Re-entering the Workforce",
          },
          {
            sectionIcon: "support",
            copy: "Tuition Assistance",
            url: "/support-resources/tuition-assistance",
            description: "Job Training, Community College, and More",
          },
          {
            sectionIcon: "support",
            copy: "Other Assistance",
            url: "/support-resources/other",
            description: "Housing, Transportation, Healthcare, and More",
          },
          {
            sectionIcon: "support",
            copy: "Frequently Asked Questions",
            url: "/faq",
          },
        ],
      },
    ],
  },
  es: {
    banner: {
      title: "Mi Carrera NJ",
      theme: "blue",
      buttonCopy: "Explora Mi Carrera NJ",
      subHeading:
        "Las herramientas que necesitas para encontrar un trabajo que funcione para ti.",
      message:
        "El trabajo adecuado está ahí afuera, si sabes dónde buscar. MyCareerNJ es un excelente lugar para comenzar, con ofertas de empleo en todo el estado de Nueva Jersey. También podemos ayudarte a descubrir posibilidades de carrera, aprender nuevas habilidades laborales, asistir en cambios de carrera y ofrecer consejos para nuevos empleados. Descubre por ti mismo cómo MyCareerNJ puede ayudarte.",
      image: {
        url: "https://images.ctfassets.net/jbdk7q9c827d/JAzMHNRnrmPy5KfO7l3PZ/c39660e2d16c0b5bf98fe3c05ab38dc3/NJCC_Hero_Image.png",
        description:
          "Cuatro imágenes de personas trabajando en diversas industrias",
        height: 521,
        width: 750,
      },
    } as PageBannerProps,
    introBlocks: {
      heading:
        "No importa en qué etapa de tu carrera te encuentres, Mi Carrera NJ está aquí para ayudarte.",
      message:
        "Explora una suite conectada de herramientas de empleo, formación y carrera para avanzar en tu desarrollo profesional.",
      sections: [
        {
          link: {
            url: "/training",
            copy: "Visita el Explorador de Capacitación de NJ",
          },
          title: "Explorador de Capacitación de NJ",
          heading:
            "Certificaciones, Desarrollo Profesional, Aprendizajes y Más!",
          message:
            "Busca por empleo, programa de capacitación y más para encontrar una formación que se adapte a ti. Algunas capacitaciones en demanda pueden ser elegibles para asistencia financiera.",
        },
        {
          link: {
            url: "/navigator",
            copy: "Visita el Navegador de Carrera de NJ",
          },
          title: "Navegador de Carrera de NJ",
          heading: "Recomendaciones de Carrera Personalizadas",
          message:
            "Obtén recomendaciones de carrera basadas en datos y personalizadas según tus habilidades y experiencia.",
        },
        {
          link: {
            url: "/career-pathways",
            copy: "Visita las Trayectorias Profesionales de NJ",
          },
          title: "Trayectorias Profesionales de NJ",
          heading: "Explora Trayectorias para Carreras en Demanda",
          message:
            "Descubre oportunidades profesionales y el potencial de crecimiento en industrias clave en Nueva Jersey. Desde el sector salud hasta la manufactura, Trayectorias Profesionales te proporciona un mapa para ayudarte a navegar tu camino hacia el éxito.",
        },
      ],
      sectionsHeading: "Cómo Mi Carrera NJ puede ayudarte:",
    },
    sectionHeading: {
      heading: "Explora Herramientas",
      strikeThrough: true,
    },
    sections: [
      {
        copy: "Encuentra un Trabajo",
        sectionId: "jobs",
        theme: "blue",
        heading: "Todas las Herramientas de Búsqueda de Empleo",
        cards: [
          {
            copy: "Navegador de Carrera de NJ",
            url: "/navigator",
            description:
              "Obtén recomendaciones personalizadas para cambios de carrera",
          },
          {
            copy: "Lista de Ocupaciones en Demanda",
            url: "/in-demand-occupations",
            description:
              "Consulta las carreras con oportunidades ahora y en el futuro en NJ",
          },
          {
            copy: "Bolsa de Trabajo de CareerOneStop",
            url: "https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=&location=New%20Jersey&radius=25&source=NLX&curPage=1&referer=%2FToolkit%2FJobs%2Ffind-jobs.aspx",
            description: "Busca ofertas de trabajo actuales en Nueva Jersey",
          },
          {
            copy: "Información del Mercado Laboral",
            url: "https://www.nj.gov/labor/labormarketinformation/",
            description: "Conoce el mercado laboral en NJ",
          },
          {
            copy: "Programas de Aprendizaje",
            url: "https://www.nj.gov/labor/career-services/apprenticeship/",
            description: "Conoce oportunidades de aprendizaje",
          },
        ],
      },
      {
        copy: "Obtén Capacitación",
        sectionId: "training",
        theme: "green",
        heading: "Todas las Herramientas de Capacitación",
        cards: [
          {
            sectionIcon: "training",
            copy: "Explorador de Capacitación de NJ",
            url: "/training",
            description: "Busca programas de capacitación en NJ",
          },
          {
            sectionIcon: "training",
            copy: "Navegador de Carrera de NJ",
            url: "/navigator",
            description:
              "Obtén recomendaciones personalizadas para cambios de carrera",
          },
          {
            sectionIcon: "training",
            copy: "Recursos de Asistencia para Matrícula",
            url: "/support-resources/tuition-assistance",
            description: "Descubre cómo obtener ayuda para pagar tu educación",
          },
          {
            sectionIcon: "training",
            copy: "Recursos para Proveedores de Capacitación",
            url: "/training-provider-resources",
            description:
              "Información importante para proveedores de capacitación",
          },
          {
            sectionIcon: "training",
            copy: "SkillUp",
            url: "https://nj.metrixlearning.com/landing.cfm",
            description: "Videos de capacitación gratuitos en línea",
          },
        ],
      },
      {
        copy: "Explora Carreras",
        sectionId: "explore",
        theme: "purple",
        heading: "Todos los Recursos de Exploración de Carrera",
        cards: [
          {
            sectionIcon: "jobs",
            copy: "Navegador de Carrera de NJ",
            url: "/navigator",
            description:
              "Obtén recomendaciones personalizadas para cambios de carrera",
          },
          {
            icon: "MapTrifold",
            sectionIcon: "explore",
            copy: "Trayectorias Profesionales de NJ",
            url: "/career-pathways",
            description:
              "Explora trabajos en demanda y oportunidades de capacitación.",
          },
        ],
      },
      {
        copy: "Encuentra Apoyo y Asistencia",
        sectionId: "support",
        theme: "navy",
        heading: "Todos los Recursos de Apoyo y Asistencia",
        cards: [
          {
            sectionIcon: "support",
            copy: "Explorar Apoyo por Categoría",
            url: "/support-resources",
          },
          {
            sectionIcon: "support",
            copy: "Apoyo Profesional",
            url: "/support-resources/career-support",
            description:
              "Orientación profesional, ayuda con la búsqueda de empleo y reinserción laboral",
          },
          {
            sectionIcon: "support",
            copy: "Asistencia para Matrícula",
            url: "/support-resources/tuition-assistance",
            description: "Capacitación laboral, colegios comunitarios y más",
          },
          {
            sectionIcon: "support",
            copy: "Otras Ayudas",
            url: "/support-resources/other",
            description: "Vivienda, transporte, salud y más",
          },
          {
            sectionIcon: "support",
            copy: "Preguntas Frecuentes",
            url: "/faq",
          },
        ],
      },
    ],
  },
};
