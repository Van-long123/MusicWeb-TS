import {Request,Response} from 'express';
import * as systemConfig from '../../config/system'
import Account from '../../models/account.model';
import md5 from 'md5'
export const index=async  (req:Request, res:Response) => {
    res.render("admin/pages/my-account/index",
        {
            title:'Thông tin cá nhân',
        }
    )
}

export const edit=async(req:Request, res:Response)=>{
    res.render("admin/pages/my-account/edit",
        {
            title:'Chỉnh sửa thông tin các nhân',
        }
    )
}
export const editPatch=async(req:Request, res:Response)=>{
    const id=res.locals.user.id;
    const existEmail=await Account.findOne({
        _id:{$ne:id},
        email:req.body.email,
        deleted:false
    })
    if(existEmail){
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
        res.redirect(`back`)
        return;
    }
    else{
        if(req.body.password){
            req.body.password=md5(req.body.password)
        }
        else{
            delete req.body.password
            await Account.updateOne({_id:id},req.body)
            res.redirect('back')
        }
    }
}
