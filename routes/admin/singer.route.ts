import { Router } from "express";
const router:Router=Router();
import multer from 'multer';
const upload=multer()
import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';

import * as controller from '../../controllers/admin/singer.controller'
router.get('/',controller.index)
// router.patch('/change-status/:status/:id',controller.changeStatus)
// router.delete('/delete/:id',controller.deleteItem)
// router.patch('/change-multi',controller.changeMulti)

// router.get('/create',controller.create)
// router.post('/create',
//     upload.single('avatar'),
//     uploadCloud.uploadSingle,
//     controller.createPost)

// router.get('/edit/:id',controller.edit)
// router.patch('/edit/:id',
//     upload.single('avatar'),
//     uploadCloud.uploadSingle,
//     controller.editPatch)


export const singerRouter:Router=router 