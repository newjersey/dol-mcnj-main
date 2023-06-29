import { api } from "./api";
import {
  FAQ_PAGE_QUERY,
  TUITION_ASSISTANCE_PAGE_QUERY,
  TRAINING_PROVIDER_PAGE_QUERY,
  NAV_QUERY,
  CAREER_PATHWAYS_PAGE_QUERY,
} from "./queries";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const contentfulFactory = (query: string): any => {
  switch (query) {
    case "cpw": {
      query = CAREER_PATHWAYS_PAGE_QUERY;
      break;
    }
    case "faq": {
      query = FAQ_PAGE_QUERY;
      break;
    }
    case "tpr": {
      query = TRAINING_PROVIDER_PAGE_QUERY;
      break;
    }
    case "frp": {
      query = TUITION_ASSISTANCE_PAGE_QUERY;
      break;
    }
    case "gnav": {
      query = NAV_QUERY("7ARTjtRYG7ctcjPd1nbCHr");
      break;
    }
    case "mnav": {
      query = NAV_QUERY("3z2JQqwp9gcolHLILD57PY");
      break;
    }
    case "footNav": {
      query = NAV_QUERY("voDscWxEvggHqcXPzUtpR");
      break;
    }
    case "footNav2": {
      query = NAV_QUERY("3WHbfXiLFSBXRC24QCq8H6");
      break;
    }
    default:
      console.log("No such query exists.");
      break;
  }

  return async () => {
    /**
     * Receive an incoming query parameter and pass a GraphQL object to it.
     */
    /**
     *
     */
    const response = await api(JSON.stringify({ query })).then((res) => {
      if (res.status === 200) {
        return res;
      } else {
        console.log(res);
      }
    });

    return response;
  };
};
