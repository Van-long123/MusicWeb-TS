import { Router } from "express";
import * as controller from '../../controllers/client/song.controller';
const router:Router=Router();
router.get('/:slugTopic',controller.index)

export const songRouter:Router=router;
