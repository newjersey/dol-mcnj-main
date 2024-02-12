import express from 'express'
import { HOMEPAGE_QUERY } from '../../queries/homePage'
import { routeHandler } from '../../routeHandler'

const industriesSubRouter = express.Router({mergeParams: true})

industriesSubRouter.get('/considerations', routeHandler(HOMEPAGE_QUERY));
industriesSubRouter.get('/hot-spots', routeHandler(HOMEPAGE_QUERY));
industriesSubRouter.get('/top-sectors', routeHandler(HOMEPAGE_QUERY));
industriesSubRouter.get('/career-maps', routeHandler(HOMEPAGE_QUERY));

export default industriesSubRouter
