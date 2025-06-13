/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export const useContentful = ({ path, disable }: { path: string; disable?: boolean }) => {
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!disable) {
      const fetchData = async () => {
        try {
          const result: any = await fetch(`/api/contentful${path}`);
          const resultJson = await result.json();
          setData(resultJson);
        } catch (error) {
          console.error(error);
          return {};
        }
      };

      fetchData();
    }
  }, [path]);

  return data;
};

export const fetchContentful = async <T = any>(path: string): Promise<T> => {
  try {
    const result = await fetch(`/api/contentful${path}`);
    const resultJson = await result.json();
    return resultJson;
  } catch (error) {
    console.error(`Error fetching Contentful data for ${path}:`, error);
    throw error;
  }
};
