import { Request,Response,NextFunction } from "express"
export const loginPost=(req,res,next)=>{
    if(!req.body.email){
        req.flash('error', `Vui lòng nhập email`);
        res.redirect(`back`);
        return;//phải thêm return để code ở dưới ko chạy vì js bất động bộ
    }
    if(!req.body.password){
        req.flash('error', `Vui lòng nhập mật khẩu`);
        req.flash('emailValue', req.body.email);
        res.redirect(`back`);
        return;//phải thêm return để code ở dưới ko chạy vì js bất động bộ
    }
    next()
}

