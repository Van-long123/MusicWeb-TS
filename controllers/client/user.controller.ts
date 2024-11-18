import { Request,Response } from "express"
import User from "../../models/user.model"
import md5 from 'md5'
import * as generateHelper from '../../helpers/generate'
import ForgotPassword from "../../models/forgor-password.model"
import * as sendMailHelper from "../../helpers/sendMail"
import { console } from "inspector"
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
    res.redirect('back')
}

export const forgotPassword=async (req:Request, res:Response) => {
    res.render('client/pages/users/forgot-password',{
        title:"Lấy lại mật khẩu"
    })
}
export const forgotPasswordPost=async (req:Request, res:Response) => {
    const email:string = req.body.email
    const user =await User.findOne({
        email:email,
        deleted:false,
        status:'active'
    })
    if(!user){
        req.flash('emailError', `Email không tồn tại`);
        req.flash('emailValue', email);
        res.redirect('back')
        return;
    }
    const otp:string=generateHelper.generateRandomNumber(6)
    const objectForgotPassword={
        email:email,
        otp:otp,
        expireAt:Date.now()
    }
    const forgotPassword=new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()
    const subject="Mã OTP xác minh lấy lại mật khẩu"
    const html=`Mã OTP để lấy lại mật khẩu là <b>${otp}</b> .Thời gian sử dụng là 3 phút`
    sendMailHelper.sendMail(email,subject,html)

    res.redirect(`/user/password/otp?email=${email}`)
}

export const otpPassword=async (req:Request, res:Response) => {
    const email=req.query.email
    res.render('client/pages/users/otp-password',{
        title:"Nhập mã OTP",
        email:email
    })
}
export const otpPasswordPost=async (req:Request, res:Response) => {
    const {email,otp}=req.body;
    const existEmail=await ForgotPassword.findOne({
        email:email
    })
    if(!existEmail){
        req.flash('error', `Email không tồn tại`);
        res.redirect('back')
        return;
    }
    if(existEmail['otp']!==otp){
        req.flash('error', `OTP không hợp lệ`);
        res.redirect('back')
        return;
    }
    const user = await User.findOne({
        email:email,
        deleted:false,
        status:'active'
    })
    if(!user){
        req.flash('emailError', `Email không tồn tại`);
        req.flash('emailValue', email);
        res.redirect('back')
        return;
    }
    res.cookie('tokenUser',user['tokenUser'])
    res.redirect('/user/password/reset');
}
export const reset=async (req:Request, res:Response) => {
    res.render('client/pages/users/reset-password',{
        title:"Đổi mật khẩu",
    })
}
export const resetPost=async (req:Request, res:Response) => {
    const password:string = req.body.password
    const tokenUser:string=req.cookies.tokenUser;
    const user=await User.findOne({
        tokenUser:tokenUser,
        deleted:false,
        status:'active'
    })
    if(!user){
        req.flash('emailError', `Nhập lại địa chỉ email!`);
        res.redirect(`/user/password/forgot`);
        return;
    }
    await User.updateOne({
        tokenUser:tokenUser,
    },{
        password:md5(password)
    })
    req.flash('success', `Đổi mật khẩu thành công`);
    res.redirect('back')
}

export const myAccount=async (req:Request, res:Response) => {
    res.locals.activePage = 'quan-ly';
    res.render('client/pages/my-account/management',{
        title:"Trang thông tin cá nhân"
    })
}
export const managePlaylist=async (req:Request, res:Response) => {
    res.locals.activePage = 'playlist';
    res.render('client/pages/my-account/management',{
        title:"Trang thông tin cá nhân"
    })
}
export const listenHistory=async (req:Request, res:Response) => {
    res.locals.activePage = 'lich-su';
    res.render('client/pages/my-account/listen-history',{
        title:"Lịch sử nghe nhạc"
    })
}