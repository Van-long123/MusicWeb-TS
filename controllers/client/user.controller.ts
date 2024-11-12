import { Request,Response } from "express"
import User from "../../models/user.model"
import md5 from 'md5'

export const login=async (req:Request, res:Response) => {
    res.render('client/pages/users/login',{
        title:"Đăng nhập tài khoản"
    })
}
export const loginPost=async (req:Request, res:Response) => {
    const {email,password}=req.body;
    const user=await User.findOne({
        email: email,
        deleted:false,
        status:'active'
    })
    if(!user){
        req.flash('emailError','Email không tồn tại')
        req.flash('emailValue',email)
        res.redirect('back')
        return;
    }
    if(user.password!=md5(password)){
        req.flash('emailValue',email)
        req.flash('passwordError','Sai mật khẩu')
        res.redirect('back')
        return;
    }
    if(user.status!='active'){
        req.flash('error','Tài khoản đã bị khóa')
        res.redirect('back')
        return;
    }
    console.log(user)
    res.cookie('tokenUser',user['tokenUser'])
    res.redirect('/')
}


export const register=async (req:Request, res:Response) => {
    res.render('client/pages/users/register',{
        title:"Đăng nhập tài khoản"
    })
}
export const registerPost=async (req:Request, res:Response) => {
    const {email,fullName}=req.body
    const existEmail=await User.findOne({
        email: email,
        deleted:false,
        status:'active'
    })
    console.log(existEmail)
    if(existEmail){
        req.flash('emailError',"Email đã tồn tại")
        req.flash('emailValue',email)
        req.flash('nameValue',fullName)
        res.redirect('back')
        return 
    }
    req.body.password=md5(req.body.password)
    const user=new User(req.body)
    await user.save()
    res.cookie("tokenUser",user.tokenUser)
    res.redirect('/')
}
export const logout=(req:Request, res:Response)=>{
    res.clearCookie('tokenUser')
    res.redirect('/')
}