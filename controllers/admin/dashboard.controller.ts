import {Request,Response} from 'express';
export const index=async  (req:Request, res:Response) => {
    res.render('admin/pages/dashboard/index',{
        title:"Trang tổng quan"
    })
}