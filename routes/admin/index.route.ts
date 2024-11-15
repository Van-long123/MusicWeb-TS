import {Express} from "express"
import {dashboardRoutes} from './dashboard.route'
const adminRoutes=(app:Express)=>{
    const PATH_ADMIN='/admin'
    app.use(PATH_ADMIN+'/dashboard',dashboardRoutes)
}
export default adminRoutes;