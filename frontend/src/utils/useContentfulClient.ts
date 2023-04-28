/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { contentfulClient } from "./contentfulClient";

export const useContentfulClient = ({
  query,
  variables,
  disable,
}: {
  query: string;
  variables?: any;
  disable?: boolean;
}) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!disable) {
      const fetchData = async () => {
        try {
          const result: any = await contentfulClient({ query, variables });
          setData(result);
        } catch (error) {
          console.error(error);
          return {};
        }
      };

      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [query]);

  return data;
};
