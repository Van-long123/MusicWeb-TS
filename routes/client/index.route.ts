import {Express} from "express"
import { homeRoutes } from "./home.route"
import { topicRouter } from "./topic.route"
import { songRouter } from "./song.route"
import { searchRouter } from "./search.route"
import { userRouter } from "./user.route"
import * as userMiddleware from '../../middlewares/client/infoUser.middleware'
const clientRoutes = (app:Express)=>{
    app.use(userMiddleware.infoUser)
    app.use('/',homeRoutes)
    app.use('/topics',topicRouter)
    app.use('/songs',songRouter)
    app.use('/search',searchRouter)
    app.use('/user',userRouter)
}
export default clientRoutes