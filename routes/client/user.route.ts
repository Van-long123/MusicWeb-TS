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
export const userRouter: Router=router

