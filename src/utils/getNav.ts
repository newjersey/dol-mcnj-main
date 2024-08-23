import { NAV_MENU_QUERY } from "queries/navMenu";
import { client } from "./client";

export const getNav = async () => {
  const globalNav = await client({
    query: NAV_MENU_QUERY,
    variables: {
      id: "7ARTjtRYG7ctcjPd1nbCHr",
    },
  });
  const mainNav = await client({
    query: NAV_MENU_QUERY,
    variables: {
      id:
        process.env.REACT_APP_FEATURE_CAREER_PATHWAYS === "true"
          ? "6z5HiOP5HqvJc07FURpT8Z"
          : "3jcP5Uz9OY7syy4zu9Viul",
    },
  });
  const footerNav1 = await client({
    query: NAV_MENU_QUERY,
    variables: {
      id: "6QDRPQOaswzG5gHPgqoOkS",
    },
  });
  const footerNav2 = await client({
    query: NAV_MENU_QUERY,
    variables: {
      id: "3WHbfXiLFSBXRC24QCq8H6",
    },
  });

  return {
    globalNav: globalNav?.menu,
    mainNav: mainNav?.menu,
    footerNav1: footerNav1?.menu,
    footerNav2: footerNav2?.menu,
  };
};
