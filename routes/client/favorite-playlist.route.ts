import {Router} from 'express'
const router: Router = Router()
import * as controller from '../../controllers/client/favorite-playlist.controller'
router.get('/',controller.index)
export const favoritePlaylistRoutes: Router=router