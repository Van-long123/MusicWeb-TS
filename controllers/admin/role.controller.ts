import {Request,Response} from 'express';
import Role from '../../models/role.model';
import * as systemConfig from '../../config/system'
export const index=async  (req:Request, res:Response) => {
    const records=await Role.find({
        deleted:false
    })
    res.render('admin/pages/roles/index',{
        title:'Nhóm quyền',
            records:records
    })
}
export const create=async  (req:Request, res:Response) => {
    res.render('admin/pages/roles/create',{
       title:'Tạo nhóm quyền'
    })
}
export const createPost=async  (req:Request, res:Response) => {
    const record=new Role(req.body)
    await record.save()
    req.flash('success', `Thêm thành công nhóm quyền`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`)

}
export const edit=async  (req:Request, res:Response) => {
    try {
        const record=await Role.findOne({
            _id: req.params.id,
            deleted:false
        })
        res.render('admin/pages/roles/edit',{
            title:'Cập nhật nhóm quyền',
            record:record
        })
    } catch (error) {
        req.flash('error','Nhóm ko tồn tại')
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}
export const editPost=async  (req:Request, res:Response) => {
    await Role.updateOne({
        _id:req.params.id,
        deleted:false
    },req.body)
    req.flash('success', `Cập nhật nhóm quyền thành công`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

export const deleteItem=async  (req:Request, res:Response) => {
    const id=req.params.id
    await Role.updateOne({
        _id:id,
    },{
        deleted:true
    })
    req.flash('success','Đã xóa sản phẩm thành công')
    res.redirect('back')
}