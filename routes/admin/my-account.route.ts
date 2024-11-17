import { Router } from "express";
const router:Router=Router();
import multer from 'multer';
const upload=multer()
import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';
import * as controller from '../../controllers/admin/my-account.controller'
router.get('/',controller.index)
router.get('/edit',controller.edit)

router.patch('/edit',upload.single('avatar'),uploadCloud.uploadSingle, controller.editPatch);

export const myAccountRouter:Router=router 