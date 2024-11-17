import { Router } from "express";
const router:Router=Router();
import multer from 'multer';
const upload=multer()
import * as validate from '../../validates/singer.validate';
import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';
import * as controller from '../../controllers/admin/account.controller'
router.get('/',controller.index)
router.patch('/change-status/:status/:id',controller.changeStatus)
router.delete('/delete/:id',controller.deleteItem)
router.patch('/change-multi',controller.changeMulti)

router.get('/create',controller.create)
router.post('/create',
    upload.single('avatar'),
    validate.createPost,
    uploadCloud.uploadSingle,
    controller.createPost)

router.get('/edit/:id',controller.edit)
router.patch('/edit/:id',
    upload.single('avatar'),
    validate.editPost,
    uploadCloud.uploadSingle,
    controller.editPatch)

router.get('/detail/:id',controller.detail)

export const accountRouter:Router=router 