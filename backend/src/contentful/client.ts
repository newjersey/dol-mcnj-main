import { GraphQLClient } from "graphql-request";
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
  const client = new GraphQLClient(
    `https://${process.env.BASE_URL}/${process.env.SPACE_ID}`,
    {
      headers,
    },
  );
  return client.request(query, variables);
};
