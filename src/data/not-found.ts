import { SystemErrorProps } from "@components/modules/SystemError";

export const NOT_FOUND_PAGE_DATA = {
  seo: {
    title: `404 Not Found | ${process.env.REACT_APP_SITE_NAME}`,
  },
  systemError: {
    heading: "Sorry, we can't seem to find that page",
    copy: '<p>Try one of these instead:</p><ul><li><a href="/training/search">Search for a training opportunity</a></li><li><a href="https://www.careeronestop.org/" target="_blank" rel="noopener noreferrer">Look up your local One-Stop Career Center</a></li></ul>',
    color: "green",
  } as SystemErrorProps,
};
