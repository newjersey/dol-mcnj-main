import { Request, Response } from 'express';
import { useClient } from './useClient';

export const routeHandler = <TVariables extends Record<string, unknown>>(query: string) => async (req: Request, res: Response) => {
    const variables: TVariables = { ...req.params, ...req.query } as TVariables;

    try {
        const result = await useClient({ query, variables });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing your Contentful request.");
    }
};
