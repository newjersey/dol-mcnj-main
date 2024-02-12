import express from 'express'
import { HOMEPAGE_QUERY } from './queries/homePage'
// import industriesRouter from './routers/industries/industries'
import { routeHandler } from './routeHandler'
import { CAREER_NAVIGATOR_QUERY } from './queries/careerNavigator'
import { ALL_SUPPORT_PAGE_QUERY } from './queries/allSupportPage'
import { FAQ_PAGE_QUERY } from './queries/faq'
import { CAREER_MAP_NODE_QUERY } from './queries/careerMapNode'
import { CAREER_PATHWAYS_PAGE_QUERY } from './queries/careerPathways'
import { NAV_MENU_QUERY } from './queries/navMenu'
import { OCCUPATION_QUERY } from './queries/occupation'
import { PATH_MENU_QUERY } from './queries/pathMenu'
import { RESOURCE_CATEGORY_QUERY } from './queries/resourceCategory'
import { TRAINING_EXPLORER_PAGE_QUERY } from './queries/trainingExplorer'
import { TRAINING_PROVIDER_PAGE_QUERY } from './queries/trainingProvider'
import { TUITION_ASSISTANCE_PAGE_QUERY } from './queries/tuitionAssistance'
import { INDUSTRY_QUERY } from './queries/industry'

const app = express()
const PORT = process.env.PORT || 3000;

app.get('/all-support', routeHandler(ALL_SUPPORT_PAGE_QUERY))
app.get('/career-map-node/:id', routeHandler(CAREER_MAP_NODE_QUERY))
app.get('/career-navigator', routeHandler(CAREER_NAVIGATOR_QUERY))
app.get('/career-pathways', routeHandler(CAREER_PATHWAYS_PAGE_QUERY))
app.get('/faq', routeHandler(FAQ_PAGE_QUERY))
app.get('/home-page', routeHandler(HOMEPAGE_QUERY));
app.get('/nav-menu/:id', routeHandler(NAV_MENU_QUERY)) 
app.get('/occupation/:id', routeHandler(OCCUPATION_QUERY))
app.get('/path-menu/:id', routeHandler(PATH_MENU_QUERY));
app.get('/resource-category/:slug', routeHandler(RESOURCE_CATEGORY_QUERY));
app.get('/training-explorer', routeHandler(TRAINING_EXPLORER_PAGE_QUERY));
app.get('/training-provider', routeHandler(TRAINING_PROVIDER_PAGE_QUERY));
app.get('/tution-assistance', routeHandler(TUITION_ASSISTANCE_PAGE_QUERY));
app.get('/industry/:slug', routeHandler(INDUSTRY_QUERY));



// app.use('/industries', industriesRouter); 

app.listen(PORT, () => {
        console.log(`server is running in ${PORT}`)
})