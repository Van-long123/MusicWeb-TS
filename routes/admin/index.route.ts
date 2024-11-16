import {Express} from "express"
import {dashboardRoutes} from './dashboard.route'
import {songRoutes} from './song.route'
import {roleRoutes} from './role.route'
import {topicRouter} from './topic.route'
import {singerRouter} from './singer.route'
import {accountRouter} from './account.route'
const adminRoutes=(app:Express)=>{
    const PATH_ADMIN='/admin'
    app.use(PATH_ADMIN+'/dashboard',dashboardRoutes)
    app.use(PATH_ADMIN+'/songs',songRoutes)
    app.use(PATH_ADMIN+'/roles',roleRoutes)
    app.use(PATH_ADMIN+'/topics',topicRouter)
    app.use(PATH_ADMIN+'/singers',singerRouter)
    app.use(PATH_ADMIN+'/accounts',accountRouter)
}
export default adminRoutes;