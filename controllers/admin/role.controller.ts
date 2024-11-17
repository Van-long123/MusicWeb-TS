import {Request,Response} from 'express';
import Role from '../../models/role.model';
import * as systemConfig from '../../config/system'
export const index=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("roles_view")){
        return;
    }
    const records=await Role.find({
        deleted:false
    })
    res.render('admin/pages/roles/index',{
        title:'Nhóm quyền',
            records:records
    })
}
export const create=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("products_edit")){
        return;
    }
    res.render('admin/pages/roles/create',{
       title:'Tạo nhóm quyền'
    })
}
export const createPost=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("roles_create")){
        return;
    }
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
    const permissions=res.locals.role.permissions
    if(!permissions.includes("roles_edit")){
        return;
    }
    await Role.updateOne({
        _id:req.params.id,
        deleted:false
    },req.body)
    req.flash('success', `Cập nhật nhóm quyền thành công`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

export const deleteItem=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("roles_delete")){
        return;
    }
    const id=req.params.id
    await Role.updateOne({
        _id:id,
    },{
        deleted:true
    })
    req.flash('success','Đã xóa sản phẩm thành công')
    res.redirect('back')
}

export const permissions=async  (req:Request, res:Response) => {
    const records=await Role.find({
        deleted:false
    })
    res.render('admin/pages/roles/permission',{
        title:"Phân quyền",
        records
    })
}
export const permissionsPatch=async  (req:Request, res:Response) => {
    const permissions1=res.locals.role.permissions
    if(!permissions1.includes("roles_permissions")){
        return;
    }
    const permissions=JSON.parse(req.body.permissions)
    for (const permission of permissions) {
        await Role.updateOne({
            _id:permission.id
        },{
            permissions:permission.permissions
        })
    }
    req.flash("success","Cập nhật phân quyền thành công")
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`)
}