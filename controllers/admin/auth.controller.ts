import {Request,Response} from 'express';
import Account from '../../models/account.model';
import * as systemConfig from '../../config/system'
export const login=async  (req:Request, res:Response) => {
    if(req.cookies.token){
        const user=await Account.findOne({
            token: req.cookies.token,
            deleted:false
        })
        if(user){
            res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
        }
    }
    else{
        res.render('admin/pages/auth/login',{
            title:'Đăng nhập',
        })
    }
    
}
export const loginPost=async  (req:Request, res:Response) => {

}