import {Request,Response} from 'express';
import Role from '../../models/role.model';
import * as systemConfig from '../../config/system'
export const index=async  (req:Request, res:Response) => {
    res.render('admin/pages/topics/index')
}