import { Router } from "express";
import * as controller from '../../controllers/admin/role.controller';
const router: Router =Router()
router.get('/',controller.index)
export const roleRoutes:Router=router