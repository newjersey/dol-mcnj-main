import dotenv from "dotenv";

dotenv.config();

export const contentfulClient = async ({
  query,
  variables,
  includeDrafts,
  excludeInvalid,
  accessToken,
}: {
  query: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: any;
  includeDrafts?: boolean;
  excludeInvalid?: boolean;
  accessToken: string;
}) => {
  // Use dynamic import for ES module graphql-request
  // This ensures we get the actual dynamic import in the compiled JS
  const graphqlRequestModule = await (eval('import("graphql-request")') as Promise<typeof import("graphql-request")>);
  const { GraphQLClient } = graphqlRequestModule;

  
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
