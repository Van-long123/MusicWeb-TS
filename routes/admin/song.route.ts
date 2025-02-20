import { Router } from "express";
import multer from 'multer';
const upload=multer()
// THIẾU VALIDATE 
import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';
import * as controller from '../../controllers/admin/song.controller';
import * as validate from '../../validates/song.validate';
const router: Router = Router();
router.get('/',controller.index)
router.patch('/change-status/:status/:idSong',controller.changeStatus)
router.patch('/change-multi',controller.changeMulti)
router.delete('/delete/:idSong',controller.deleteItem)

router.get('/create',controller.create)
router.post('/create',
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
    validate.createPost,
    uploadCloud.uploadFields,
    controller.createPost)

router.get('/edit/:id',controller.edit)
router.patch('/edit/:id',
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'audio', maxCount: 1 }]),
    validate.editPost,
    uploadCloud.uploadFields,
    controller.editPost)
router.get('/detail/:id',controller.detail)

export const songRoutes:Router=router