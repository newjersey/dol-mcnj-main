import { CtaBanner } from "@components/blocks/CtaBanner";
import type { Meta, StoryObj } from "@storybook/react";
import { IconNames } from "@utils/enums";

const meta: Meta<typeof CtaBanner> = {
  title: "Components/Blocks/CTA Banner",
  component: CtaBanner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CtaBanner>;

export const Default: Story = {
  args: {
    heading: "Aliquam laoreet placerat orci, sit amet.",
    headingLevel: 2,
    theme: "green",
    noIndicator: true,
    items: [
      {
        url: "/career-pathways",
        copy: "NJ Career Pathways",
      },
      {
        url: "/in-demand-occupations",
        copy: "In-Demand Occupations",
      },
    ],
  },
};

export const WithColorfulButtons: Story = {
  args: {
    fullColor: true,
    headingLevel: 2,
    theme: "blue",
    items: [
      {
        url: "/career-pathways",
        copy: "NJ Career Pathways",
        icon: "MapTrifold" as IconNames,
      },
      {
        url: "/in-demand-occupations",
        copy: "In-Demand Occupations",
        icon: "Fire" as IconNames,
      },
      {
        url: "https://www.careeronestop.org/",
        copy: "One Stop Job Board",
        icon: "Briefcase" as IconNames,
      },
      {
        url: "/training-explorer",
        copy: "Training Explorer",
        icon: "GraduationCap" as IconNames,
      },
    ],
    customLinks: [
      {
        iconPrefix: "MapTrifold" as IconNames,
        link: "/career-pathways",
        label: "NJ Career Pathways",
        type: "link",
        highlight: "blue",
      },
      {
        iconPrefix: "Fire" as IconNames,
        link: "/in-demand-occupations",
        label: "In-Demand Occupations",
        type: "link",
        highlight: "orange",
      },
      {
        iconPrefix: "Briefcase" as IconNames,
        link: "https://www.careeronestop.org/",
        label: "One Stop Job Board",
        type: "link",
        highlight: "navy",
      },
      {
        iconPrefix: "GraduationCap" as IconNames,
        link: "/training-explorer",
        label: "Training Explorer",
        type: "link",
        highlight: "green",
      },
    ],
    heading: "Not ready to sign up? Check out these other tools.",
  },
};

export const Purple: Story = {
  args: {
    fullColor: true,
    heading:
      "Suspendisse porttitor neque suscipit erat blandit, a feugiat urna interdum.",
    headingLevel: 2,
    theme: "purple",
    items: [
      {
        url: "/career-pathways",
        copy: "NJ Career Pathways",
        icon: "MapTrifold" as IconNames,
      },
      {
        url: "/in-demand-occupations",
        copy: "In-Demand Occupations",
        icon: "Fire" as IconNames,
      },
      {
        url: "https://www.careeronestop.org/",
        copy: "One Stop Job Board",
        icon: "Briefcase" as IconNames,
      },
      {
        url: "/training-explorer",
        copy: "Training Explorer",
        icon: "GraduationCap" as IconNames,
      },
    ],
    customLinks: [
      {
        iconPrefix: "MapTrifold" as IconNames,
        link: "/career-pathways",
        label: "NJ Career Pathways",
        type: "link",
        highlight: "purple",
      },
      {
        iconPrefix: "Fire" as IconNames,
        link: "/in-demand-occupations",
        label: "In-Demand Occupations",
        type: "link",
        highlight: "purple",
      },
    ],
  },
};

export const Contained: Story = {
  args: {
    fullColor: true,
    heading:
      "Suspendisse porttitor neque suscipit erat blandit, a feugiat urna interdum.",
    headingLevel: 2,
    contained: true,
    theme: "navy",
    items: [
      {
        url: "/career-pathways",
        copy: "NJ Career Pathways",
        icon: "MapTrifold" as IconNames,
      },
      {
        url: "/in-demand-occupations",
        copy: "In-Demand Occupations",
        icon: "Fire" as IconNames,
      },
      {
        url: "https://www.careeronestop.org/",
        copy: "One Stop Job Board",
        icon: "Briefcase" as IconNames,
      },
      {
        url: "/training-explorer",
        copy: "Training Explorer",
        icon: "GraduationCap" as IconNames,
      },
    ],
    customLinks: [
      {
        iconPrefix: "Briefcase" as IconNames,
        link: "https://www.careeronestop.org/",
        label: "One Stop Job Board",
        type: "link",
        highlight: "blue",
      },
      {
        iconPrefix: "GraduationCap" as IconNames,
        link: "/training-explorer",
        label: "Training Explorer",
        type: "link",
        highlight: "blue",
      },
    ],
  },
};
