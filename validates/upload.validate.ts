import { Request,Response,NextFunction } from "express"
export const createPost=(req:Request, res:Response,next:NextFunction)=>{
    if(!req.body.title){
        req.flash('error', `Vui lòng nhập tiêu đề`);
        res.redirect(`back`);
        return;
    }
    if(!req.body.topicId){
        req.flash('error', `Vui lòng chọn chủ để`);
        res.redirect(`back`);
        return;
    }
    if(!req.body.singerId){
        req.flash('error', `Vui lòng chọn ca sĩ`);
        res.redirect(`back`);
        return;
    }

    
    if(!req.body.lyrics){
        req.flash('error', `Vui lòng nhập lời bài hát`);
        res.redirect(`back`);
        return;
    }
    if(!req.body.description){
        req.flash('error', `Vui lòng nhập mô tả`);
        res.redirect(`back`);
        return;
    }
    
    next()
}   