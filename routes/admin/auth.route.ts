import { Router } from "express";
const router:Router=Router();
import * as controller from '../../controllers/admin/auth.controller'
router.get('/login',controller.login)
router.post('/login',controller.loginPost)
// router.post('/login',controller.login)
export const authRouter:Router=router 
