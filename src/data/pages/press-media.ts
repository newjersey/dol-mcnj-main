import { PageHeroProps } from "@components/blocks/PageHero";
import image1 from "@images/placeholder.png";
import { ButtonProps } from "@utils/types";

export const PRESS_MEDIA_DATA = {
  seo: {
    title: `Press and Media | ${process.env.REACT_APP_SITE_NAME}`,
    pageDescription: "Press and Media resources for My Career NJ.",
    keywords: [
      "Press",
      "Media",
      "New Jersey",
      "Career",
      "Training",
      "Job",
      "My Career NJ",
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
    pageHero: {
      heading: "Press and Media",
      theme: "blue",
      subheading:
        "Welcome to the press and media resource page for My Career NJ",
    } as PageHeroProps,
    cardGrid: {
      heading: "Media",
      description: "Cras eu velit bibendum, tempor enim non, volutpat metus.",
      items: [
        {
          title: "Card Title",
          description: "Card description goes here.",
          button: {
            label: "Learn More",
            link: "#",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          image: {
            src: image1.src,
            alt: "Placeholder",
            width: image1.width,
            height: image1.height,
          },
          title: "Card Title",
          description: "Card description goes here.",
          button: {
            label: "Learn More",
            link: "#",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          image: {
            src: image1.src,
            alt: "Placeholder",
            width: image1.width,
            height: image1.height,
          },
          title: "Card Title",
          description: "Card description goes here.",
          button: {
            label: "Learn More",
            link: "#",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
      ],
    },
  },
  es: {
    pageHero: {
      heading: "Press and Media",
      theme: "blue",
      subheading:
        "Welcome to the press and media resource page for My Career NJ",
    } as PageHeroProps,
    cardGrid: {
      heading: "Media",
      description: "Cras eu velit bibendum, tempor enim non, volutpat metus.",
      items: [
        {
          image: {
            src: image1.src,
            alt: "Placeholder",
            width: image1.width,
            height: image1.height,
          },
          title: "Card Title",
          description: "Card description goes here.",
          button: {
            label: "Learn More",
            link: "#",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          image: {
            src: image1.src,
            alt: "Placeholder",
            width: image1.width,
            height: image1.height,
          },
          title: "Card Title",
          description: "Card description goes here.",
          button: {
            label: "Learn More",
            link: "#",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
        {
          image: {
            src: image1.src,
            alt: "Placeholder",
            width: image1.width,
            height: image1.height,
          },
          title: "Card Title",
          description: "Card description goes here.",
          button: {
            label: "Learn More",
            link: "#",
            iconSuffix: "ArrowRight",
          } as ButtonProps,
        },
      ],
    },
  },
};
