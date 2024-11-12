import { Request,Response,NextFunction } from "express"
export const loginPost=(req:Request, res:Response,next:NextFunction)=>{
    if(!req.body.email){
        req.flash('emailError', `Vui lòng nhập email`);
        res.redirect(`back`);
        return;
    }
    if(!req.body.password){
        req.flash('emailValue',req.body.email)
        req.flash('passwordError', `Vui lòng nhập mật khẩu`);
        res.redirect(`back`);
        return;//phải thêm return để code ở dưới ko chạy vì js bất động bộ
    }
    next()
}