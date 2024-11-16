import {Request,Response} from 'express';
import Account from '../../models/account.model';
import * as systemConfig from '../../config/system'
import md5 from 'md5'
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
    const {email,password}=req.body;
    const user=await Account.findOne({
        email: email,
        deleted:false
    })
    if(!user){
        req.flash('error', `Email không tồn tại`);
        req.flash('emailValue', req.body.email);
        res.redirect('back')
        return;
    }
    if(md5(password)!=user.password){
        req.flash('error', `Sai mật khẩu`);
        req.flash('emailValue', req.body.email);
        res.redirect('back')
        return;
    }
    if(user.status!='active'){
        req.flash('error', `Tài khoản đã bị khóa`);
        res.redirect('back')
        return;
    }
    res.cookie('token',user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
}
export const logout=async  (req:Request, res:Response) => {
    res.clearCookie('token')
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
}