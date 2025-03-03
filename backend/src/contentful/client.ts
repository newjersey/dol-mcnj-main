import { GraphQLClient } from "graphql-request";
import dotenv from "dotenv"

dotenv.config()

export const contentfulClient = ({
  query,
  variables,
  includeDrafts,
  excludeInvalid,
  accessToken
}: {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: any;
  includeDrafts?: boolean;
  excludeInvalid?: boolean;
  accessToken: string;
}) => { 
  const headers: {
    authorization: string;
    "X-Include-Drafts"?: string;
    "X-Exclude-Invalid"?: string;
  } = {
    authorization: `Bearer ${accessToken}`,
  };
  if (includeDrafts) {
    headers["X-Include-Drafts"] = "true";
  }
  if (excludeInvalid) {
    headers["X-Exclude-Invalid"] = "true";
  }
  const environment = process.env.ENVIRONMENT || "master";
  const client = new GraphQLClient(
    `https://${process.env.BASE_URL}/${process.env.SPACE_ID}/environments/${environment}`,
    {
      headers,
    },
  );
  return client.request(query, variables);
};
