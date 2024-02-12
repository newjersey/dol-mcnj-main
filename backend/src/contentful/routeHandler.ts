import {Request, Response} from 'express'
import { useClient } from './useClient'

export const routeHandler = (query: any) => async (req: Request, res: Response) => {
    const variables = req.params || req.query
    try {
        const result = await useClient({query, variables})
        res.send(result)
    } catch (error) {
        console.log(error)
    }
}