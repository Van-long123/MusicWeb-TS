import {Express} from "express"
import {dashboardRoutes} from './dashboard.route'
import {songRoutes} from './song.route'
import {roleRoutes} from './role.route'
import {topicRouter} from './topic.route'
import {singerRouter} from './singer.route'
import {accountRouter} from './account.route'
import {userRouter} from './user.route'
import {settingRouter} from './setting.route'
import {authRouter} from './auth.route'
import {myAccountRouter} from './my-account.route'
import * as authMiddleware from '../../middlewares/admin/auth.middleware'
const adminRoutes=(app:Express)=>{
    const PATH_ADMIN='/admin'
    app.use(PATH_ADMIN+'/dashboard',authMiddleware.requireAuth,dashboardRoutes)
    app.use(PATH_ADMIN+'/songs',authMiddleware.requireAuth,songRoutes)
    app.use(PATH_ADMIN+'/roles',authMiddleware.requireAuth,roleRoutes)
    app.use(PATH_ADMIN+'/topics',authMiddleware.requireAuth,topicRouter)
    app.use(PATH_ADMIN+'/singers',authMiddleware.requireAuth,singerRouter)
    app.use(PATH_ADMIN+'/accounts',authMiddleware.requireAuth,accountRouter)
    app.use(PATH_ADMIN+'/users',authMiddleware.requireAuth,userRouter)
    app.use(PATH_ADMIN+'/settings',authMiddleware.requireAuth,settingRouter)
    app.use(PATH_ADMIN+'/my-account',authMiddleware.requireAuth,myAccountRouter)
    app.use(PATH_ADMIN+'/auth',authRouter)
}
export default adminRoutes;