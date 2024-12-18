import { Router } from "express";
import * as controller from '../../controllers/client/user.controller';
import * as validate from '../../validates/user.validate';
import multer from 'multer';
const upload=multer()
import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';

const router: Router =Router();
router.get('/login', controller.login)
router.post('/login',validate.loginPost, controller.loginPost);

router.get('/register', controller.register)
router.post('/register',validate.registerPost, controller.registerPost);

router.get('/logout', controller.logout)

router.get('/password/forgot',controller.forgotPassword)
router.post('/password/forgot',validate.forgotPassword,controller.forgotPasswordPost)

router.get('/password/otp',controller.otpPassword)
router.post('/password/otp',controller.otpPasswordPost)


router.get('/password/reset',controller.reset)
router.post('/password/reset',validate.resetPasswordPost,controller.resetPost)

router.get('/manage-account',controller.myAccount)
router.get('/listening-history',controller.listenHistory)
router.get('/manage-my-playlists',controller.managePlaylist)

router.get('/edit-account',controller.editAccount)

router.patch('/edit-account', 
    upload.single('avatar'),
uploadCloud.uploadSingle,
controller.editAccountPatch)


router.delete('/song/delete/:id',controller.deleteItem)
router.delete('/song/delete-multi',controller.deleteMulti)

export const userRouter: Router=router

