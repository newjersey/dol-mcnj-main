import { useEffect } from "react";
import ReactGA from "react-ga";

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [title]);
};
