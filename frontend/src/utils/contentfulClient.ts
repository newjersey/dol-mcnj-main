import { GraphQLClient } from "graphql-request";
export const contentfulClient = ({
  query,
  variables,
  includeDrafts,
  excludeInvalid,
}: {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: any;
  includeDrafts?: boolean;
  excludeInvalid?: boolean;
}) => {
  const headers: {
    authorization: string;
    "X-Include-Drafts"?: string;
    "X-Exclude-Invalid"?: string;
  } = {
    authorization: `Bearer ${process.env.REACT_APP_DELIVERY_API}`,
  };
  if (includeDrafts) {
    headers["X-Include-Drafts"] = "true";
  }
  if (excludeInvalid) {
    headers["X-Exclude-Invalid"] = "true";
  }
  const client = new GraphQLClient(
    `https://${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_SPACE_ID}/environments/${process.env.REACT_APP_ENVIRONMENT}`,
    {
      headers,
    },
  );
  return client.request(query, variables);
};
