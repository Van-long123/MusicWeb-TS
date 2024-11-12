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

export const registerPost=(req:Request, res:Response,next:NextFunction)=>{
    if(!req.body.fullname){
        req.flash('nameError', `Vui lòng nhập họ tên`);
        res.redirect(`back`);
        return;
    }
    if(!req.body.phone){
        req.flash('phoneError', `Vui lòng nhập số điện thoại`);
        res.redirect(`back`);
        return;
    }
    if(!req.body.address){
        req.flash('addressError', `Vui lòng nhập địa chỉ`);
        res.redirect(`back`);
        return;
    }
    if(!req.body.email){
        req.flash('emailError', `Vui lòng nhập email`);
        res.redirect(`back`);
        return;//phải thêm return để code ở dưới ko chạy vì js bất động bộ
    }
    if(!req.body.password){
        req.flash('error', `Vui lòng nhập mật khẩu`);
        res.redirect(`back`);
        return;//phải thêm return để code ở dưới ko chạy vì js bất động bộ
    }
    if(!req.body.confirmPassword){
        req.flash('error', `Vui lòng nhập xác nhận mật khẩu`);
        res.redirect(`back`);
        return;//phải thêm return để code ở dưới ko chạy vì js bất động bộ
    }
    if(req.body.password!=req.body.confirmPassword){
        req.flash('error', `Mật khẩu không khớp`);
        res.redirect(`back`);
        return;//phải thêm return để code ở dưới ko chạy vì js bất động bộ
    }
    next()
}