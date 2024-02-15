import { Request, Response } from "express";
import { useClient } from "./useClient";

export const routeHandler =
  <TVariables extends Record<string, unknown>>(query: string) =>
  async (req: Request, res: Response) => {
    const variables: TVariables = { ...req.params, ...req.query } as TVariables;
    console.log({ variables });
    // check if any of the variables are a stringified JSON object and parse them
    Object.keys(variables).forEach((key) => {
      if (typeof variables[key] === "string") {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (variables as any)[key] = JSON.parse(variables[key] as string);
        } catch (error) {
          console.error(error);
        }
      }
    });

    try {
      const result = await useClient({ query, variables });
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your Contentful request.");
    }
  };
