export const TRAINING_EXPLORER_PAGE_DATA = {
  seo: {
    title: "NJ Training Explorer",
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
  },
  demoVideoUrl: "https://www.youtube.com/embed/fSBbrIoQAFE?si=MmBcyHbiB5PjZrxR",
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
      description: "Contact programs to set up a visit and learn how to apply.",
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
  },

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
    },
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
    ],
  },
};
