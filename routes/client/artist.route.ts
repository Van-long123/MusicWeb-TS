import { Router } from "express";
import * as controller from '../../controllers/client/artist.controller'
const router:Router=Router();
router.get('/:slugArtist',controller.index)
export const artistRouter:Router = router