import { Router } from "express";
import * as controller from '../../controllers/client/playlist.controller'
const router:Router=Router();
router.get('/',controller.index)
router.patch('/favorite/:typeFavorite/:idPlaylist',controller.favorite)
router.get('/my-playlist',controller.myPlaylist)
router.post('/create',controller.createPost)
router.delete('/delete',controller.deleteItem)
router.patch('/add/:idPlaylist/:idSong',controller.addSongInPlaylist)

router.get('/:slug',controller.detail)



export const playlistRouter:Router =router;