/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { contentfulClient } from "./contentfulClient";

export const useContentfulClient = ({
  query,
  variables,
}: {
  query: string;
  variables?: string;
}) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
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
  }, [query]);

  return data;
};
