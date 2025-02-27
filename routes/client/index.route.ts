import {Express} from "express"
import { homeRoutes } from "./home.route"
import { topicRouter } from "./topic.route"
import { songRouter } from "./song.route"
import { searchRouter } from "./search.route"
import { userRouter } from "./user.route"
import { artistRouter } from "./artist.route" 
import { playlistRouter } from "./playlist.route"
import { favoriteSongRoutes } from "./favorite-song.route"
import { favoritePlaylistRoutes } from "./favorite-playlist.route"
import { authRouter } from "./auth.route"
import * as userMiddleware from '../../middlewares/client/infoUser.middleware'
import * as settingMiddleware from '../../middlewares/client/setting.middleware'
const clientRoutes = (app:Express)=>{
    app.use(userMiddleware.infoUser)
    app.use(settingMiddleware.settingGeneral)
    app.use('/',homeRoutes)
    app.use('/topics',topicRouter)
    app.use('/songs',songRouter)
    app.use('/search',searchRouter)
    app.use('/user',userRouter)
    app.use('/favorite-songs',favoriteSongRoutes)
    app.use('/favorite-playlists',favoritePlaylistRoutes)
    app.use('/artist',artistRouter)
    app.use('/playlists',playlistRouter)
    app.use('/auth',authRouter)
}
export default clientRoutes