import express from 'express'
import { INDUSTRY_QUERY } from '../../queries/industry'
import  industriesSubRouter from './subRouter'
import { routeHandler } from '../../routeHandler'

const industriesRouter = express.Router()
industriesRouter.get('/', routeHandler(INDUSTRY_QUERY));
industriesRouter.use('/:id', industriesSubRouter)

export default industriesRouter