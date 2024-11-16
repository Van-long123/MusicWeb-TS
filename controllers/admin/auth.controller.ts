import {Request,Response} from 'express';
export const login=async  (req:Request, res:Response) => {
    res.render('admin/pages/auth/login',{
        title:'Đăng nhập',
    })
}