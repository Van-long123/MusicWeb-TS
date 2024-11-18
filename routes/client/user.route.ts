import { Router } from "express";
import * as controller from '../../controllers/client/user.controller';
import * as validate from '../../validates/user.validate';
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

router.get('/quan-ly',controller.myAccount)
router.get('/lich-su-nghe-nhac',controller.listenHistory)
router.get('/quan-ly-playlist-cua-tui',controller.managePlaylist)

export const userRouter: Router=router

