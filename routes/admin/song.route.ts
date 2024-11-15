import { Router } from "express";
import multer from 'multer';
const upload=multer()
import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';
// import * as middleware from '../../middlewares/admin/uploadCloud.middleware';
import * as controller from '../../controllers/admin/song.controller';
const router: Router = Router();
router.get('/',controller.index)
router.patch('/change-status/:status/:idSong',controller.changeStatus)
router.patch('/change-multi',controller.changeMulti)
router.delete('/delete/:idSong',controller.deleteItem)

router.get('/create',controller.create)
router.post('/create',
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
    uploadCloud.uploadFields,
    controller.createPost)

router.get('/edit/:id',controller.edit)
router.patch('/edit/:id',
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
    uploadCloud.uploadFields,
    controller.editPost)
router.get('/detail/:id',controller.detail)

export const songRoutes:Router=router