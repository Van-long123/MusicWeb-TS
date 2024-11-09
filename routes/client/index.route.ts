import {Express} from "express"
import { homeRoutes } from "./home.route"
import { topicRouter } from "./topic.route"
import { songRouter } from "./song.route"
const clientRoutes = (app:Express)=>{
    app.use('/',homeRoutes)
    app.use('/topics',topicRouter)
    app.use('/songs',songRouter)
}
export default clientRoutes