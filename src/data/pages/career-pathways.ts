import { CtaBannerProps } from "@components/blocks/CtaBanner";
import { MinimalBannerProps } from "@components/blocks/MinimalBanner";
import mechanic from "@images/mechanic.jpg";
import medical from "@images/medical.jpg";
import welder from "@images/welder.jpg";
import { IndustrySelectorProps } from "@utils/types/components";
import placeholder2 from "@images/pathway1.jpg";
import placeholder1 from "@images/pathway2.jpg";
import { ThemeColors } from "@utils/types";

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
              title: "Why to consider a Manufacturing Career",
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
              title: "Why to consider a Healthcare Career",
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
              title: "Why to consider a TDL Career",
              copy: "### Quality Jobs\n\nMany jobs in transportation distribution and logistics offer long-term employment, and opportunities for advancement, great benefits, on the job training and mentorship.\n\n### For a variety of interests\n\nThe industry offers opportunities for people who like working with customers – flight attendants and train conductors, for example - as well as people who like to build and fix things and solve problems, like engineers, service technicians, and mechanics.\n\n### Important Contribution\n\nTransportation disctribulation and logistics are all critical to the economy and society. When you work in transportation, you can go to work every day knowing you are having an impact on people.",
            },
            {
              icon: "Star",
              title: "Top Manufacturing Sectors",
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
    banner: {
      heading: "¡Bienvenido a New Jersey Career Pathways!",
      description:
        "Con New Jersey Career Pathways, explorar trabajos en demanda y oportunidades de capacitación nunca ha sido tan fácil.",
      tag: {
        color: "navy",
        title: "Beta",
        tooltip:
          "Nuestro equipo está investigando y desarrollando más trayectorias profesionales. Vuelve regularmente para ver las actualizaciones.",
        icon: "Info",
      },
      crumbs: {
        pageTitle: "NJ Career Pathways",
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
            "Explora trayectorias profesionales en el campo de la manufactura en el estado de Nueva Jersey.",
          drawerDescription:
            "Todo lo que no existe en la naturaleza debe ser fabricado, como barras de chocolate, ropa y zapatos, aviones y turbinas eólicas. En pocas palabras, manufacturar significa 'hacer cosas'.",
          drawerCards: [
            {
              icon: "Factory",
              title: "Por qué considerar una carrera en Manufactura",
              copy: "### Potencial de crecimiento\n\nMuchas empresas de manufactura ofrecen capacitación en el trabajo, por lo que siempre hay oportunidades para crecer y avanzar en tu carrera.\n\n### Innovación\n\nNuevas tecnologías innovadoras como la robótica, dispositivos portátiles, impresión 3D y drones se desarrollan y utilizan en la manufactura.\n\n### Gratificante\n\nPuedes ver el resultado de tu trabajo en un objeto tangible. Las personas que trabajan en este campo pueden decir: 'Yo hice eso'.",
            },
            {
              icon: "Star",
              title: "Principales sectores de Manufactura",
              copy: "### Alimentos\n\nLos fabricantes de alimentos eligen Nueva Jersey porque el estado está en el centro de una de las áreas metropolitanas más grandes del país. Los alimentos producidos en Nueva Jersey llegan fácilmente a millones de personas. Nuestro estado alberga algunas de las marcas de alimentos más importantes del mundo, como Campbell's Soup, Mars Bars, M&Ms y Nabisco, todos hechos aquí. Marcas emergentes como Oatly y Bai también comenzaron aquí.\n\n### Farmacéutica\n\nNueva Jersey es conocida como 'El Botiquín del Mundo' debido a su importancia en la industria farmacéutica global. Empresas como Novartis, Merck & Co., Johnson & Johnson, Bristol-Myers Squibb, Novo Nordisk y Bayer Healthcare tienen presencia en el estado. Las compañías farmacéuticas eligen Nueva Jersey por su mano de obra altamente calificada, incluyendo científicos.\n\n### Metales Fabricados\n\nLos fabricantes de metales transforman los metales en piezas utilizadas en aviones, puentes, edificios, computadoras, maquinaria, barcos, generación de energía y más. Las empresas de esta industria forjan, estampan, doblan, sueldan, moldean y mecanizan metales. Hoy en día, los fabricantes de metales logran un nivel de precisión inimaginable hace 20 años, utilizando tecnologías como el torneado, la impresión 3D, el corte por plasma y el fresado con dispositivos CNC.",
            },
          ],
        },
        {
          image: medical,
          title: "Salud",
          slug: "healthcare",
          active: false,
          description:
            "Las trayectorias para este sector están en desarrollo, pero aún puedes explorar las ocupaciones más demandadas en salud.",
          drawerDescription:
            "Promueve y protege el bienestar de tu comunidad: descubre tu próximo paso profesional en el sector salud. Los trabajos a continuación representan las posiciones más demandadas en el estado de Nueva Jersey. Cualquier persona interesada en una carrera en salud debe pasar una verificación de antecedentes para garantizar la seguridad de los pacientes.",
          drawerCards: [
            {
              icon: "Stethoscope",
              title: "Por qué considerar una carrera en Salud",
              copy: "### Seguridad laboral\n\nLa salud es una de las industrias de más rápido crecimiento y más estables para trabajar. Es la única industria que ha agregado empleos en el estado todos los años desde 1990 hasta 2019, incluso en tiempos de recesión.\n\n### Opciones educativas\n\nExisten trabajos para personas con diferentes niveles educativos.\n\n### Trabajo bien remunerado y significativo\n\nPuedes hacer una diferencia real en la vida de las personas mientras ganas un buen salario.",
            },
            {
              icon: "Star",
              title: "Principales sectores de la Salud",
              copy: "### Hospitales\n\nLos hospitales brindan atención a pacientes hospitalizados. El tipo más común es el hospital general, que suele contar con un departamento de emergencias, quirófanos, salas de diagnóstico y habitaciones para el tratamiento y recuperación de pacientes. Los hospitales también son centros de formación y lugares clave para la investigación clínica.\n\n### Consultorios de médicos y dentistas\n\nLos consultorios de médicos y dentistas son solo dos de los muchos tipos de entornos de atención ambulatoria. Otros incluyen laboratorios de diagnóstico, centros de atención urgente, centros de cirugía ambulatoria y centros de rehabilitación.\n\n### Cuidado de enfermería y residencial\n\nLas personas que necesitan supervisión las 24 horas, pero no hospitalización, permanecen en centros de cuidado de enfermería y residenciales. Reciben una combinación de servicios de salud y sociales proporcionados por enfermeros especializados.",
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
            "Las rutas para este sector están en desarrollo, pero aún puedes explorar las ocupaciones más demandadas en TDL.",
          drawerDescription:
            "Sé una parte importante de la cadena de suministro de nuestra nación con una carrera en transporte, distribución y logística (TDL). La diversidad de roles y responsabilidades laborales que se enumeran a continuación representa las últimas posiciones de TDL en demanda en el estado de Nueva Jersey.",
          drawerCards: [
            {
              icon: "Truck",
              title: "¿Por qué considerar una carrera en TDL?",
              copy: `### Trabajos de calidad\n\nMuchos trabajos en transporte, distribución y logística ofrecen empleo a largo plazo, oportunidades de ascenso, grandes beneficios, formación en el puesto de trabajo y tutoría.\n\n### Para una variedad de intereses\n\nLa industria ofrece oportunidades para personas a las que les gusta trabajar con clientes, como asistentes de vuelo y conductores de trenes, así como para personas a las que les gusta construir y reparar cosas y resolver problemas, como ingenieros, técnicos de servicio y mecánicos.\n\n### Contribución Importante\n\nEl transporte, la distribución y la logística son fundamentales para la economía y la sociedad. Cuando trabajas en transporte, puedes ir a trabajar todos los días sabiendo que estás teniendo un impacto en las personas.`,
            },
            {
              icon: "Star",
              title: "Principales Sectores de Fabricación",
              copy: `### Transporte Aéreo\n\nLos aviones se utilizan para mover pasajeros o carga. Pueden ser programados o bajo demanda, y las empresas que los operan varían desde grandes aerolíneas hasta transportistas regionales. Nueva Jersey alberga tres aeropuertos comerciales—Newark Liberty, Trenton Mercer y Atlantic City—ocho aeropuertos que admiten actividades de aviación general corporativa y privada, 30 aeropuertos de uso público, una base de hidroaviones, así como varios helipuertos y puertos de globos aerostáticos.\n\n### Transporte por Carretera\n\nLos camiones juegan un papel importante en la economía de Nueva Jersey, como parte de la industria del transporte de carga. Las terminales y los centros de almacenamiento conectan estos sistemas para entregar bienes y crear empleos. De los más de 600 millones de toneladas de bienes transportados cada año, el 75 por ciento se mueve en camión. Existen reglas y regulaciones que rigen a los conductores y camiones en esta industria.\n\n### Almacenamiento\n\nEl almacenamiento es el proceso de guardar inventario físico para la venta o distribución. Los almacenes son utilizados por todo tipo de empresas que necesitan almacenar temporalmente productos a granel antes de enviarlos a otras ubicaciones o individualmente a los consumidores finales.`,
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
            theme: "blue" as ThemeColors,
            copy: `## Trayectorias profesionales y sectores industriales: ¿cuál es la diferencia?\n\n### Piensa en las trayectorias profesionales como un GPS.\n\nCareer Pathways ofrece la mejor ruta para llegar a tu destino profesional, describiendo los pasos que debes seguir para llegar a donde quieres ir, incluyendo educación, capacitación y mejora de habilidades.\n\n### Piensa en la información del sector industrial como una guía.\n\nLa información del sector industrial proporciona una visión general de diversas industrias, incluyendo una imagen del mercado laboral. Aquí hay información útil que encontrarás:\n\n- Tipos de empleos\n- Expectativas salariales\n- Habilidades específicas en alta demanda\n- Empresas clave en la industria\n- Potencial de crecimiento del sector`,
          },
        ],
      },
      {
        image: placeholder2,
        contentBlocks: [
          {
            theme: "purple" as ThemeColors,
            copy: `## Es importante tomar decisiones informadas. Descubre cómo Career Pathways e información del sector industrial pueden ayudarte.\n\nA través de Career Pathways e información del sector industrial, podrás tomar decisiones impactantes basadas en datos. Por ejemplo, si decides explorar la Trayectoria Profesional en Manufactura, descubrirás:\n- Información sobre los trabajos más demandados en manufactura en Nueva Jersey\n- Perspectivas de más de 40 empresas de manufactura en Nueva Jersey\n- Datos valiosos sobre oportunidades laborales\n- Las habilidades, educación y experiencia necesarias para comenzar.`,
          },
          {
            theme: "green" as ThemeColors,
            copy: `## Nuestra investigación puede ayudarte a avanzar en tu carrera.\n\nNuestra información proviene de fuentes confiables con datos actualizados:\n\n- Analistas del mercado laboral de Nueva Jersey con experiencia en tendencias laborales\n- Empleadores reales en Nueva Jersey\n- Encuestas recientes de empleo y salarios\n\nCada trayectoria profesional es diferente. Con Career Pathways y la información del sector industrial, tendrás lo necesario para avanzar con éxito.`,
          },
        ],
      },
    ],
    markdownSection: ``,
    ctaBanner: {
      heading: "Explora estas otras herramientas útiles.",
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
          label: "Ocupaciones en demanda",
          type: "link",
          highlight: "orange",
        },
        {
          iconPrefix: "Briefcase",
          link: "https://www.careeronestop.org/",
          label: "Bolsa de trabajo One Stop",
          type: "link",
          highlight: "navy",
        },
        {
          iconPrefix: "GraduationCap",
          link: "/training",
          label: "Explorador de Capacitación NJ",
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
