import manufacturingImage from "../images/welder.jpg";
import healthcareImage from "../images/medical.jpg";
import tdlImage from "../images/mechanic.jpg";
export const content = {
  banner: {
    title: "Welcome to New Jersey Career Pathways!",
    description:
      "With New Jersey Career Pathways, exploring in-demand jobs and training opportunities has never been easier.",
  },
  betaToolTip:
    "Our team is currently researching and developing more pathways. Check back regularly for updates.",
  industrySelector: {
    heading: "Choose an industry below to start exploring.",
    items: [
      {
        image: manufacturingImage,
        title: "Manufacturing",
        slug: "manufacturing",
        active: true,
        description:
          "Explore career pathways in the field of Manufacturing in the state of New Jersey.",
      },
      {
        image: healthcareImage,
        title: "Healthcare",
        slug: "healthcare",
        active: false,
        description:
          "Pathways for this sector are in development but you can still explore the most in-demand healthcare occupations.",
      },
      {
        image: tdlImage,
        title: "Transportation, Distribution, and Logistics",
        shorthandTitle: "TDL",
        slug: "tdl",
        active: false,
        description:
          "Pathways for this sector are in development but you can still explore the most in-demand TDL occupations.",
      },
    ],
  },
  markdownSection: `
  ## What are Career Pathways?

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

  ## Methodology

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

  ## Data

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
  `,
  cta: {
    heading: "Still have a question about My Career NJ?",
    button: {
      text: "Contact Us",
      url: "/contact",
    },
  },
};
