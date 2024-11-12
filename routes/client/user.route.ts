import { Router } from "express";
import * as controller from '../../controllers/client/user.controller';
import * as validate from '../../validates/user.validate';
const router: Router =Router();
router.get('/login', controller.login)
router.post('/login',validate.loginPost, controller.loginPost);


export const userRouter: Router=router

