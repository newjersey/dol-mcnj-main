import { CtaBannerProps } from "@components/blocks/CtaBanner";
import { MinimalBannerProps } from "@components/blocks/MinimalBanner";
import mechanic from "@images/mechanic.jpg";
import medical from "@images/medical.jpg";
import welder from "@images/welder.jpg";
import { IndustrySelectorProps } from "@utils/types/components";
import placeholder2 from "@images/pathway1.jpg";
import placeholder1 from "@images/pathway2.jpg";
import bannerImage from "@images/pathwayBanner.jpg";
import { PageHeroProps } from "@components/blocks/PageHero";

export const CAREER_PATHWAYS_PAGE_DATA = {
  seo: {
    title: `New Jersey Career Pathways | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription:
      "Explore popular industries and careers in the state of New Jersey.",
    keywords: [
      "New Jersey",
      "Career",
      "Job",
      "Training",
      "Career Pathways",
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
      heading: "NJ Career Pathways",
      image: bannerImage,
      subheading: "Map Out Your Career Path:",
      description:
        "The pathways tool is easy to use! It saves you time by bringing high-growth career paths, training options, and job opportunities into one place, to explore your next steps with ease, and without stress.",
      theme: "purple",
      buttons: [
        {
          label: "Start Exploring",
          iconSuffix: "ArrowDown",
          defaultStyle: "tertiary",
          link: "#industry-selector",
        },
      ],
    } as PageHeroProps,
    banner: {
      heading: "Welcome to New Jersey Career Pathways!",
      description:
        "With New Jersey Career Pathways, exploring in-demand jobs and training opportunities has never been easier.",
      tag: {
        color: "navy",
        title: "Beta",
        tooltip:
          "Our team is currently researching and developing more pathways. Check back regularly for updates.",
        icon: "Info",
      },
      crumbs: {
        pageTitle: "NJ Career Pathways",
        items: [
          {
            copy: "Home",
            url: "/",
          },
        ],
      },
    } as MinimalBannerProps,
    industrySelector: {
      heading: "Choose an industry below to start exploring.",
      items: [
        {
          image: welder,
          title: "Manufacturing",
          slug: "manufacturing",
          active: true,
          description:
            "Explore career pathways in the field of Manufacturing in the state of New Jersey.",
          drawerDescription:
            "Everything that doesn't exist in nature has to be manufactured, such as candy bars, apparel and shoes, airplanes, and wind turbines. Simply put, manufacturing means “making things.”",
          drawerCards: [
            {
              icon: "Factory",
              title: "Why consider a Manufacturing Career",
              copy: "### Growth potential\n\nA lot of manufacturing companies offer on-site job training, so there is always room to grow and advance your career.\n\n### Cutting edge\n\nInnovative new technologies like robotics, wearables, 3D printing, and drones get developed and used in manufacturing.\n\n### Gratifying\n\nYou can actually see the outcome of your work in a tangible object. People who work in the field can say, “I made that.”",
            },
            {
              icon: "Star",
              title: "Top Manufacturing Sectors",
              copy: "### Food\n\nFood manufacturers pick New Jersey because the state is at the center of one of the nation's largest metropolitan areas. And so, food produced in New Jersey easily reaches millions of people. Our state is home to some of the world's leading food brands like Campbells Soup, Mars Bars, M&Ms, and Nabisco – all made right here in the state. New and upcoming brands like Oatly and Bai started here too.\n\n### Pharmaceuticals\n\nNew Jersey is known as “The Medicine Chest of the World” because of its importance to the global pharmaceutical industry. Novartis, Merck & Co., Johnson & Johnson, Bristol-Myers Squibb, Novo Nordisk, and Bayer Healthcare are among the state's leading firms in the industry. Pharmaceutical companies are in New Jersey because the state has a highly educated workforce, including scientists.\n\n### Fabricated Metals\n\nMetal manufacturers transform metals into parts that are used in airplanes, bridges, buildings, computers, machinery, ships, power generation, and more. Companies in this industry forge, stamp, bend, weld, shape, and machine metals. Nowadays, metal manufacturers achieve a level of precision that was undreamed of just 20 years ago to do things like lathing, 3-D printing, plasma cutting, and milling using computer numerical control (CNC) devices.",
            },
          ],
        },
        {
          image: medical,
          title: "Healthcare",
          slug: "healthcare",
          active: false,
          description:
            "Pathways for this sector are in development but you can still explore the most in-demand healthcare occupations.",
          drawerDescription:
            "Promote and maintain the well-being of your community — discover your next career move in healthcare. The jobs below represent the latest in-demand healthcare positions in the state of New Jersey. Anyone interested in a career in healthcare is required to pass a background check to keep patients safe.",
          drawerCards: [
            {
              icon: "Stethoscope",
              title: "Why consider a Healthcare Career",
              copy: "### Job Security\n\nHealthcare is one of the fastest growing and most stable industries to work in. Health care is the only industry that has added jobs in the state every year from 1990 through 2019, even in times of recessions.\n\n### Educational Options\n\nThere are jobs for people at all education levels.\n\n### Well Paid Meaningful Work\n\nYou can make a meaningful difference in people's lives while earning a living.",
            },
            {
              icon: "Star",
              title: "Top Healthcare Sectors",
              copy: "### Hospitals\n\nHospitals provide people with inpatient care. The most common type of hospital is a general hospital, which typically has an emergency department, operating rooms, diagnostic rooms, and rooms where patients receive treatment and recuperate. Doctors, nurses and other healthcare professionals often receive education in hospitals. Hospitals are also important places for clinical research.\n\n### Doctors' and Dentists' Offices\n\nDoctors' and dentists' offices are just two of many types of outpatient or ambulatory care settings. Other types include diagnostic laboratories, urgent care centers, same-day surgery centers, and rehabilitation centers.\n\n### Nursing and Residential Care\n\nPeople who need 24-hour supervision, but don't need to be hospitalized stay in nursing and residential care settings. The care they receive can be a mix of health and social services. Health services provided in nursing and residential care settings are often provided by skilled nurses.",
            },
          ],
        },
        {
          image: mechanic,
          title: "Transportation, Distribution, and Logistics",
          shorthandTitle: "TDL",
          slug: "tdl",
          active: false,
          description:
            "Pathways for this sector are in development but you can still explore the most in-demand TDL occupations.",
          drawerDescription:
            "Be an important part of our nation's supply chain with a career in transportation, distribution, and logistics (TDL). The diverse range of job roles and responsibilities listed below represent the latest in-demand TDL positions in the state of New Jersey.",
          drawerCards: [
            {
              icon: "Truck",
              title: "Why consider a TDL Career",
              copy: "### Quality Jobs\n\nMany jobs in Transportation Distribution and Logistics offer long-term employment, and opportunities for advancement, great benefits, on the job training and mentorship.\n\n### For a variety of interests\n\nThe industry offers opportunities for people who like working with customers – flight attendants and train conductors, for example - as well as people who like to build and fix things and solve problems, like engineers, service technicians, and mechanics.\n\n### Important Contribution\n\nTransportation, Distribution, and Logistics are all critical to the economy and society. When you work in transportation, you can go to work every day knowing you are having an impact on people.",
            },
            {
              icon: "Star",
              title: "Top TDL Sectors",
              copy: "### Air Transportation\n\nAircraft are used to move passengers or cargo. They can be scheduled or on-demand and the companies that run them range in size from major airlines to regional carriers. New Jersey is home to three commercial airports - Newark Liberty, Trenton Mercer, and Atlantic City - eight airports that support corporate and private-use general aviation activities, 30 other public-use airports, one seaplane base, as well as several heliports and balloon ports.\n\n### Road Trucking\n\nTrucks play a major role in the New Jersey economy, a part of the larger freight industry. Terminals and warehousing centers connect these systems to deliver goods and also jobs. Of the more than 600 million tons of goods moved each year, 75 percent move by truck. There are rules and regulations that govern the drivers and trucks in this industry\n\n### Warehousing\n\nWarehousing is the process of storing physical inventory for sale or distribution. Warehouses are used by all different types of businesses that need to temporarily store products in bulk before either shipping them to other locations or individually to end consumers.",
            },
          ],
        },
      ],
    } as IndustrySelectorProps,
    bodyContent: [
      {
        image: placeholder1,
        contentBlocks: [
          {
            theme: "blue",
            copy: `## Career Pathways and Industry Sectors—what's the difference, exactly?\n\n### Think of Career Pathways as a GPS.\n\nCareer Pathways offers the best route to reach your career destination, outlining the steps you need to take to get where you want to go, including education, training, and upskilling.\n\n### Think of Industry Sector Information as a guidebook.\n\nIndustry Sector Information provides an overview of various industries, including a snapshot of the job market. Here's some of the helpful information you'll find:\n\n- Types of jobs\n- Salary expectations\n- Specific skills in high demand\n- Companies that are the major players\n- Potential for Industry growth`,
          },
        ],
      },
      {
        image: placeholder2,
        contentBlocks: [
          {
            theme: "purple",
            copy: `## It's important to make informed choices. See how Career Pathways and Industry Sector Information can help.\n\nThrough Career Pathways and Industry Sector Information, you'll be able to make impactful, data-driven decisions. For instance, if you choose to explore the Manufacturing Career Pathway, you'll discover:\n\n- Information about the most in-demand manufacturing jobs in New Jersey\n- Insights from over 40 manufacturing companies throughout New Jersey\n- Valuable data about available jobs\n- The skills, education, and experience you need to get started.`,
          },
          {
            theme: "green",
            copy: `## Our legwork can help you get a leg up in your career.\n\nOur data comes from trusted sources with the most up-to-date information:\n\n- Experienced New Jersey labor market analysts who study job trends\n- Actual New Jersey employers\n- Recent employment and wage surveys\n\nEveryone's career path is different. With Career Pathways and Industry Sector Information, you'll have what you need to help you move forward successfully.`,
          },
        ],
      },
    ],
    markdownSection: ``,
    ctaBanner: {
      heading: "Explore these other great tools.",
      fullColor: true,
      theme: "purple",
      headingLevel: 3,
      customLinks: [
        {
          iconPrefix: "Compass",
          link: "/navigator",
          label: "NJ Career Navigator",
          type: "link",
          highlight: "blue",
        },
        {
          iconPrefix: "Fire",
          link: "/in-demand-occupations",
          label: "In-Demand Occupations",
          type: "link",
          highlight: "orange",
        },
        {
          iconPrefix: "Briefcase",
          link: "https://www.careeronestop.org/",
          label: "One Stop Job Board",
          type: "link",
          highlight: "navy",
        },
        {
          iconPrefix: "GraduationCap",
          link: "/training",
          label: "NJ Training Explorer",
          type: "link",
          highlight: "green",
        },
      ],
    } as CtaBannerProps,
    cta: {
      heading: "Still have a question about My Career NJ?",
      className: "light",
      contained: true,
      items: [
        {
          copy: "Contact Us",
          url: "/contact",
        },
      ],
    } as CtaBannerProps,
  },
  es: {
    pageHero: {
      heading: "Rutas Profesionales de NJ",
      image: bannerImage,
      subheading: "Traza tu Ruta Profesional:",
      description:
        "¡La herramienta de rutas es fácil de usar! Te ahorra tiempo al reunir en un solo lugar trayectorias profesionales de alto crecimiento, opciones de capacitación y oportunidades laborales, para que explores tus próximos pasos con facilidad y sin estrés.",
      theme: "purple",
      buttons: [
        {
          label: "Comienza a Explorar",
          iconSuffix: "ArrowDown",
          defaultStyle: "tertiary",
          link: "#industry-selector",
        },
      ],
    } as PageHeroProps,
    banner: {
      heading: "¡Bienvenido a las Rutas Profesionales de Nueva Jersey!",
      description:
        "Con Rutas Profesionales de Nueva Jersey, explorar empleos en demanda y oportunidades de capacitación nunca ha sido tan fácil.",
      tag: {
        color: "navy",
        title: "Beta",
        tooltip:
          "Nuestro equipo está investigando y desarrollando más rutas. Vuelve con frecuencia para ver actualizaciones.",
        icon: "Info",
      },
      crumbs: {
        pageTitle: "Rutas Profesionales de NJ",
        items: [
          {
            copy: "Inicio",
            url: "/",
          },
        ],
      },
    } as MinimalBannerProps,
    industrySelector: {
      heading: "Elige una industria a continuación para comenzar a explorar.",
      items: [
        {
          image: welder,
          title: "Manufactura",
          slug: "manufacturing",
          active: true,
          description:
            "Explora rutas profesionales en el campo de la manufactura en el estado de Nueva Jersey.",
          drawerDescription:
            "Todo lo que no existe en la naturaleza tiene que ser fabricado, como barras de chocolate, ropa y zapatos, aviones y turbinas eólicas. En pocas palabras, manufactura significa “hacer cosas”.",
          drawerCards: [
            {
              icon: "Factory",
              title: "Por qué considerar una Carrera en Manufactura",
              copy: "### Potencial de crecimiento\n\nMuchas empresas de manufactura ofrecen capacitación en el lugar de trabajo, por lo que siempre hay oportunidades para crecer y avanzar en tu carrera.\n\n### A la vanguardia\n\nNuevas tecnologías innovadoras como la robótica, los dispositivos portátiles, la impresión 3D y los drones se desarrollan y utilizan en la manufactura.\n\n### Gratificante\n\nPuedes ver realmente el resultado de tu trabajo en un objeto tangible. Las personas que trabajan en este campo pueden decir: “Yo hice eso.”",
            },
            {
              icon: "Star",
              title: "Sectores Principales de Manufactura",
              copy: "### Alimentos\n\nLos fabricantes de alimentos eligen Nueva Jersey porque el estado está en el centro de una de las áreas metropolitanas más grandes del país. Por eso, los alimentos producidos en Nueva Jersey llegan fácilmente a millones de personas. Nuestro estado alberga algunas de las marcas de alimentos más importantes del mundo como Campbells Soup, Mars Bars, M&Ms y Nabisco – todas hechas aquí en el estado. Marcas nuevas y emergentes como Oatly y Bai también comenzaron aquí.\n\n### Farmacéuticos\n\nNueva Jersey es conocida como “El Botiquín del Mundo” por su importancia para la industria farmacéutica global. Novartis, Merck & Co., Johnson & Johnson, Bristol-Myers Squibb, Novo Nordisk y Bayer Healthcare están entre las principales empresas del estado en esta industria. Las compañías farmacéuticas están en Nueva Jersey porque el estado cuenta con una fuerza laboral altamente educada, incluyendo científicos.\n\n### Metales Fabricados\n\nLos fabricantes de metales transforman los metales en piezas que se utilizan en aviones, puentes, edificios, computadoras, maquinaria, barcos, generación de energía y más. Las empresas en esta industria forjan, estampan, doblan, sueldan, moldean y mecanizan metales. Hoy en día, los fabricantes de metales logran un nivel de precisión inimaginable hace apenas 20 años para realizar cosas como torneado, impresión 3D, corte por plasma y fresado usando dispositivos de control numérico por computadora (CNC).",
            },
          ],
        },
        {
          image: medical,
          title: "Salud",
          slug: "healthcare",
          active: false,
          description:
            "Las rutas para este sector están en desarrollo, pero aún puedes explorar las ocupaciones de salud más demandadas.",
          drawerDescription:
            "Promueve y mantén el bienestar de tu comunidad — descubre tu próximo movimiento profesional en el área de la salud. Los empleos a continuación representan las posiciones de salud más demandadas en el estado de Nueva Jersey. Cualquier persona interesada en una carrera en salud debe pasar una verificación de antecedentes para mantener a los pacientes seguros.",
          drawerCards: [
            {
              icon: "Stethoscope",
              title: "Por qué considerar una Carrera en Salud",
              copy: "### Seguridad Laboral\n\nLa salud es una de las industrias de más rápido crecimiento y más estables para trabajar. Es la única industria que ha agregado empleos en el estado cada año desde 1990 hasta 2019, incluso en tiempos de recesión.\n\n### Opciones Educativas\n\nExisten trabajos para personas con todos los niveles educativos.\n\n### Trabajo Bien Pagado y Significativo\n\nPuedes marcar una diferencia significativa en la vida de las personas mientras ganas un salario.",
            },
            {
              icon: "Star",
              title: "Sectores Principales de Salud",
              copy: "### Hospitales\n\nLos hospitales brindan atención hospitalaria. El tipo más común es el hospital general, que típicamente cuenta con un departamento de emergencias, quirófanos, salas de diagnóstico y habitaciones donde los pacientes reciben tratamiento y se recuperan. Los médicos, enfermeras y otros profesionales de la salud a menudo reciben educación en hospitales. Los hospitales también son lugares importantes para la investigación clínica.\n\n### Consultorios de Médicos y Dentistas\n\nLos consultorios de médicos y dentistas son solo dos de muchos tipos de entornos de atención ambulatoria. Otros incluyen laboratorios de diagnóstico, centros de atención urgente, centros de cirugía ambulatoria y centros de rehabilitación.\n\n### Cuidados de Enfermería y Residenciales\n\nLas personas que necesitan supervisión las 24 horas, pero que no requieren hospitalización, permanecen en entornos de cuidado de enfermería y residenciales. La atención que reciben puede ser una mezcla de servicios de salud y sociales. Los servicios de salud proporcionados en entornos de enfermería y residenciales suelen ser ofrecidos por enfermeras calificadas.",
            },
          ],
        },
        {
          image: mechanic,
          title: "Transporte, Distribución y Logística",
          shorthandTitle: "TDL",
          slug: "tdl",
          active: false,
          description:
            "Las rutas para este sector están en desarrollo, pero aún puedes explorar las ocupaciones de TDL más demandadas.",
          drawerDescription:
            "Sé una parte importante de la cadena de suministro de nuestra nación con una carrera en transporte, distribución y logística (TDL). La diversa gama de roles y responsabilidades que aparecen a continuación representan las posiciones de TDL más demandadas en el estado de Nueva Jersey.",
          drawerCards: [
            {
              icon: "Truck",
              title: "Por qué considerar una Carrera en TDL",
              copy: "### Empleos de Calidad\n\nMuchos trabajos en transporte, distribución y logística ofrecen empleo a largo plazo, oportunidades de ascenso, excelentes beneficios, capacitación en el trabajo y mentoría.\n\n### Para una variedad de intereses\n\nLa industria ofrece oportunidades para personas a las que les gusta trabajar con clientes – como auxiliares de vuelo y conductores de tren, por ejemplo – así como para personas a las que les gusta construir, reparar y resolver problemas, como ingenieros, técnicos de servicio y mecánicos.\n\n### Contribución Importante\n\nEl transporte, la distribución y la logística son fundamentales para la economía y la sociedad. Cuando trabajas en transporte, puedes ir a trabajar cada día sabiendo que estás teniendo un impacto en las personas.",
            },
            {
              icon: "Star",
              title: "Sectores Principales de TDL",
              copy: "### Transporte Aéreo\n\nLas aeronaves se utilizan para mover pasajeros o carga. Pueden ser programadas o a demanda, y las compañías que las operan varían en tamaño desde aerolíneas importantes hasta transportistas regionales. Nueva Jersey cuenta con tres aeropuertos comerciales – Newark Liberty, Trenton Mercer y Atlantic City – ocho aeropuertos que apoyan la aviación corporativa y privada, 30 aeropuertos de uso público, una base de hidroaviones, así como varios helipuertos y puertos para globos aerostáticos.\n\n### Transporte por Carretera\n\nLos camiones desempeñan un papel importante en la economía de Nueva Jersey, como parte de la industria de carga más amplia. Los terminales y centros de almacenamiento conectan estos sistemas para entregar mercancías y también empleos. De los más de 600 millones de toneladas de bienes movidos cada año, el 75 por ciento se transporta por camión. Existen normas y regulaciones que rigen a los conductores y camiones en esta industria.\n\n### Almacenamiento\n\nEl almacenamiento es el proceso de guardar inventario físico para la venta o distribución. Los almacenes son utilizados por todo tipo de empresas que necesitan almacenar productos temporalmente en grandes cantidades antes de enviarlos a otros lugares o directamente a los consumidores finales.",
            },
          ],
        },
      ],
    } as IndustrySelectorProps,
    bodyContent: [
      {
        image: placeholder1,
        contentBlocks: [
          {
            theme: "blue",
            copy: `## Rutas Profesionales y Sectores Industriales — ¿cuál es la diferencia, exactamente?\n\n### Piensa en las Rutas Profesionales como un GPS.\n\nLas Rutas Profesionales ofrecen la mejor ruta para alcanzar tu destino profesional, describiendo los pasos que debes seguir para llegar a donde quieres, incluyendo educación, capacitación y mejora de habilidades.\n\n### Piensa en la Información de Sectores Industriales como una guía.\n\nLa Información de Sectores Industriales ofrece una visión general de varias industrias, incluyendo una panorámica del mercado laboral. Aquí tienes información útil que encontrarás:\n\n- Tipos de trabajos\n- Expectativas salariales\n- Habilidades específicas en alta demanda\n- Empresas que son los principales actores\n- Potencial de crecimiento de la industria`,
          },
        ],
      },
      {
        image: placeholder2,
        contentBlocks: [
          {
            theme: "purple",
            copy: `## Es importante tomar decisiones informadas. Mira cómo las Rutas Profesionales y la Información de Sectores Industriales pueden ayudarte.\n\nA través de las Rutas Profesionales y la Información de Sectores Industriales, podrás tomar decisiones impactantes basadas en datos. Por ejemplo, si eliges explorar la Ruta Profesional de Manufactura, descubrirás:\n\n- Información sobre los trabajos de manufactura más demandados en Nueva Jersey\n- Perspectivas de más de 40 empresas manufactureras en Nueva Jersey\n- Datos valiosos sobre empleos disponibles\n- Las habilidades, educación y experiencia que necesitas para comenzar.`,
          },
          {
            theme: "green",
            copy: `## Nuestro trabajo previo puede ayudarte a avanzar en tu carrera.\n\nNuestros datos provienen de fuentes confiables con la información más actualizada:\n\n- Analistas del mercado laboral de Nueva Jersey que estudian tendencias de empleo\n- Empleadores reales de Nueva Jersey\n- Encuestas recientes de empleo y salarios\n\nCada trayectoria profesional es diferente. Con Rutas Profesionales e Información de Sectores Industriales, tendrás lo que necesitas para avanzar con éxito.`,
          },
        ],
      },
    ],
    markdownSection: ``,
    ctaBanner: {
      heading: "Explora estas otras excelentes herramientas.",
      fullColor: true,
      theme: "purple",
      headingLevel: 3,
      customLinks: [
        {
          iconPrefix: "Compass",
          link: "/navigator",
          label: "Navegador de Carreras de NJ",
          type: "link",
          highlight: "blue",
        },
        {
          iconPrefix: "Fire",
          link: "/in-demand-occupations",
          label: "Ocupaciones en Demanda",
          type: "link",
          highlight: "orange",
        },
        {
          iconPrefix: "Briefcase",
          link: "https://www.careeronestop.org/",
          label: "Bolsa de Trabajo One Stop",
          type: "link",
          highlight: "navy",
        },
        {
          iconPrefix: "GraduationCap",
          link: "/training",
          label: "Explorador de Capacitación de NJ",
          type: "link",
          highlight: "green",
        },
      ],
    } as CtaBannerProps,
    cta: {
      heading: "¿Aún tienes preguntas sobre My Career NJ?",
      className: "light",
      contained: true,
      items: [
        {
          copy: "Contáctanos",
          url: "/contact",
        },
      ],
    } as CtaBannerProps,
  },
};
