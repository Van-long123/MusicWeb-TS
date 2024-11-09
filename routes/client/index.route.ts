import {Express} from "express"
import { homeRoutes } from "./home.route"
import { topicRouter } from "./topic.route"
const clientRoutes = (app:Express)=>{
    app.use('/',homeRoutes)
    app.use('/topics',topicRouter)
}
export default clientRoutes