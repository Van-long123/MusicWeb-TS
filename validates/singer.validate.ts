import { Request,Response,NextFunction } from "express"
export const createPost=(req:Request, res:Response,next:NextFunction)=>{
    if(!req.body.fullName){
        req.flash('error', `Vui lòng nhập họ và tên`);
        res.redirect(`back`);
        return;
    }
    next();
}
export const editPost=(req:Request, res:Response,next:NextFunction)=>{
    if(!req.body.fullName){
        req.flash('error', `Vui lòng nhập họ và tên`);
        res.redirect(`back`);
        return;
    }
    next();
}