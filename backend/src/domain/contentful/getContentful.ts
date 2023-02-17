import { GetContentfulFAQ } from "../types";
import { ContentfulFAQQuery } from "./ContentfulInterface";
import { api } from "./getContentfulAPI";
import { faqQuery, trainingProviderQuery } from "./getContentfulGQLQueries";

export const contentfulFactory = (): GetContentfulFAQ => {
  return async (
    query: string,
  ): Promise<ContentfulFAQQuery> => {

    /**
     * Receive an incoming query parameter and pass a GraphQL object to it.
     */
    switch ( query ) {

      case "faq": {
        query = faqQuery;
        break;
      }

      case "tpr": {
        query = trainingProviderQuery;
        break;
      }

      default:
        console.log("No such query exists.");
        break;
    }

    /**
     * 
     */
    const response = await api( JSON.stringify({ query }) ).then((res) => {
      if (res.status === 200) {
        return res;
      } else {
        console.log(res);
      }
    });

    return response;
  };
};
