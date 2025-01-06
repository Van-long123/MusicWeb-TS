import { Router } from "express";
import multer from 'multer'
const upload=multer()
import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';
import * as validate from '../../validates/topic.validate'

import * as controller from '../../controllers/admin/playlist.controller'
const router:Router=Router()
router.get('/',controller.index)
router.get('/detail/:id',controller.detail)
router.patch('/change-multi',controller.changeMulti)
router.patch('/change-status/:status/:id',controller.changeStatus)
router.delete('/delete/:id',controller.deleteItem)
       
router.get('/create',controller.create)
router.post('/create',upload.single('avatar'),validate.editPost,uploadCloud.uploadSingle,controller.createPost)


router.get('/edit/:id',controller.edit)
router.patch('/edit/:id',
    upload.single('avatar'),
    validate.editPost,
    uploadCloud.uploadSingle,
    
    controller.editPatch)
export const playlistRouter:Router =router