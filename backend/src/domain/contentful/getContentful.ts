import { api } from "./api";
import {
  FAQ_PAGE_QUERY,
  FINANCIAL_RESOURCES_PAGE_QUERY,
  TRAINING_PROVIDER_PAGE_QUERY,
} from "./queries";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const contentfulFactory = (query: string): any => {
  switch (query) {
    case "faq": {
      query = FAQ_PAGE_QUERY;
      break;
    }
    case "tpr": {
      query = TRAINING_PROVIDER_PAGE_QUERY;
      break;
    }
    case "frp": {
      query = FINANCIAL_RESOURCES_PAGE_QUERY;
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
