import {Request,Response} from 'express';
import fillterStatusHelper from '../../helpers/fillterStatusHelper';
import search from '../../helpers/search';
import pagination from '../../helpers/paginationHelper';
import * as systemConfig from '../../config/system'
import Topic from '../../models/topic.model';
import Singer from '../../models/singer.model';
import User from '../../models/user.model';
import md5 from 'md5'
export const index=async  (req:Request, res:Response) => {
    // const permissions=res.locals.role.permissions
    // if(!permissions.includes("users_view")){
    //     return;
    // }
    let find={
        deleted:false
    }
    let sort ={
    }
    let fillterStatus=fillterStatusHelper(req.query)
    if(req.query.status){
        find['status']=req.query.status
    }
    const objectSeach=search(req.query)
    const keyword=objectSeach.keyword
    if(req.query.keyword){
        find['$or']=[
            {
                fullName:objectSeach['keywordRegex']
            }
        ]
    }
    //pagination
    const countTopics=await Singer.countDocuments(find)
    const objectPagination=pagination(req.query,countTopics,{
        currentPage:1,
        limitItems:8
    })
    //pagination
    const records=await User.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    res.render('admin/pages/users/index',{
        title:"Danh sách tài khoản",
        records:records,
        fillterStatus:fillterStatus,
        keyword:keyword,
        pagination:objectPagination
    })
}
export const changeStatus=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("users_edit")){
        return;
    }
    const status=req.params.status
    const id=req.params.id
    // const updatedBy={
    //     account_id:String,
    //     updatedAt:new Date()
    // }
    await User.updateOne({
        _id:id
    },{
        status:status
    })
    req.flash('success', 'Cập nhật trạng thái tài khoản thành công');
    res.redirect('back');
}
export const deleteItem=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("users_delete")){
        return;
    }
    const id=req.params.id
    await User.updateOne({
        _id:id
    },{
        deleted:true
    })
    req.flash('success','Đã xóa tài khoản thành công')
    res.redirect('back')
}


export const changeMulti=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("users_edit")){
        return;
    }
    const type=req.body.type
    let ids: string[] = req.body.ids.split(',').map((id:string) => id.trim());

    // let ids:string[]=req.body.ids.split(',').map((id:string)=>{return id.trim()})
    switch (type) {
        case 'active':
            await User.updateMany({
                _id:{$in:ids}
            },{
                status:'active'
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} tài khoản`);
            break;
        case 'inactive':
            await User.updateMany({
                _id:{$in:ids}
            },{
                status:'inactive'
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} tài khoản`);
            break;
        case 'delete-all':
            await User.updateMany({
                _id:{$in:ids}
            },{
                deleted:true
            })
            req.flash('success', `Xóa thành công ${ids.length} tài khoản`);
            break;
    }
    res.redirect('back')
}
export const create=async  (req:Request, res:Response) => {
    res.render('admin/pages/users/create',{
        title:"Thêm tài khoản mới",
    })
}
export const createPost=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("users_create")){
        return;
    }
    const existEmail=await User.findOne({
        email:req.body.email,
        deleted:false
    })
    if(existEmail){
        req.flash('error', `Email đã tồn tại`);
        res.redirect(`back`);
        return;
    }
    req.body.password=md5(req.body.password)
    const user=new User(req.body);
    user.save()
    req.flash('success', `Đã thêm thành công tài khoản`);
    res.redirect(`${systemConfig.prefixAdmin}/users`);
}

export const edit=async  (req:Request, res:Response) => {
    try {
        const data=await User.findOne({
            _id:req.params.id,
            deleted:false
        })
        res.render('admin/pages/users/edit',{
            title:"Cập nhật tài khoản",
            data:data
        })
    } catch (error) {
        
    }
}
export const editPatch=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("users_edit")){
        return;
    }
    const emailExist=await User.findOne({
        _id:{$ne:req.params.id},
        email:req.body.email,
        deleted:false
    })
    if(emailExist){
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
        }
        await User.updateOne({
            _id:req.params.id
        },req.body)
        req.flash('success', `Cập nhật thành công tài khoản`);
        res.redirect('back') 
    }
}

export const detail=async  (req:Request, res:Response) => {
    try {
        
        const user=await User.findOne({
            _id:req.params.id,
            deleted:false
        })
        res.render('admin/pages/users/detail',{
            title:user.fullName,
            user:user,
        })
    } catch (error) {
        
    }
    
}