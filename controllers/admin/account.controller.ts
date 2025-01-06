import {Request,Response} from 'express';
import Role from '../../models/role.model';
import fillterStatusHelper from '../../helpers/fillterStatusHelper';
import search from '../../helpers/search';
import pagination from '../../helpers/paginationHelper';
import * as systemConfig from '../../config/system'
import Topic from '../../models/topic.model';
import Singer from '../../models/singer.model';
import Account from '../../models/account.model';
import md5 from 'md5'
export const index=async  (req:Request, res:Response) => {
    // const permissions=res.locals.role.permissions
    // if(!permissions.includes("accounts_view")){
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
                title:objectSeach['keywordRegex']
            },
            {
                slug:objectSeach['slugRegex']
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
    const accounts=await Account.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)

    for (const account of accounts) {
        const role=await Role.findOne({
            _id:account.role_id
        })
        account['role']=role
    }
    
    res.render('admin/pages/accounts/index',{
        title:"Danh sách tài khoản",
        records:accounts,
        fillterStatus:fillterStatus,
        keyword:keyword,
        pagination:objectPagination,
    })
}
export const changeStatus=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("accounts_view")){
        return;
    }
    const status=req.params.status
    const id=req.params.id
    const updatedBy={
        account_id:res.locals.user.id,
        updatedAt:new Date()
    }
    console.log(id)
    console.log(status)
    await Account.updateOne({
        _id:id
    },{
        status:status
    })
    req.flash('success', 'Cập nhật trạng thái tài khoản thành công');
    res.redirect('back');
}
export const deleteItem=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("accounts_delete")){
        return;
    }
    const id=req.params.id
    await Account.updateOne({
        _id:id
    },{
        deleted:true
    })
    req.flash('success','Đã xóa ca sĩ thành công')
    res.redirect('back')
}


export const changeMulti=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("accounts_edit")){
        return;
    }
    const type=req.body.type
    let ids: string[] = req.body.ids.split(',').map((id:string) => id.trim());

    // let ids:string[]=req.body.ids.split(',').map((id:string)=>{return id.trim()})
    switch (type) {
        case 'active':
            await Account.updateMany({
                _id:{$in:ids}
            },{
                status:'active'
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} tài khoản`);
            break;
        case 'inactive':
            await Account.updateMany({
                _id:{$in:ids}
            },{
                status:'inactive'
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} tài khoản`);
            break;
        case 'delete-all':
            await Account.updateMany({
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
    const roles=await Role.find({deleted:false})
    res.render('admin/pages/accounts/create',{
        title:"Thêm tài khoản mới",
        roles:roles
    })
}
export const createPost=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("accounts_create")){
        return;
    }
    const emailExist=await Account.findOne({
        email:req.body.email,
        deleted:false 
    })
    if(emailExist){
        req.flash('error', `Email đã tồn tại`);
        res.redirect(`back`);
        return;
    }
    req.body.password=md5(req.body.password)
    const account=new Account(req.body);
    account.save()
    req.flash('success', `Đã thêm thành công tài khoản`);
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
}

export const edit=async  (req:Request, res:Response) => {
    try {
        const account=await Account.findOne({
            _id:req.params.id
        })
        const roles=await Role.find({deleted:false})
        res.render('admin/pages/accounts/edit',{
            title:"Thêm tài khoản mới",
            data:account,
            roles:roles
        })
    } catch (error) {
        
    }
}
export const editPatch=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("accounts_edit")){
        return;
    }
    const emailExist=await Account.findOne({
        _id:{$ne:req.params.id},
        email:req.body.email,
        deleted:false 
    })
    if(emailExist){
        req.flash('error', `Email đã tồn tại`);
        res.redirect(`back`);
        return;
    }
    if(req.body.password){
        req.body.password=md5(req.body.password)
    }
    else{
        delete req.body.password
    }
    await Account.updateOne({_id:req.params.id},req.body);
    req.flash('success', `Cập nhật thành công tài khoản`);
    res.redirect(`back`);
}

export const detail=async  (req:Request, res:Response) => {
    try {
        
        const account=await Account.findOne({
            _id:req.params.id,
            deleted:false
        })
        console.log(account)
        res.render('admin/pages/accounts/detail',{
            title:"Chi tiết tài khoản",
            account:account,
        })
    } catch (error) {
        
    }
    
}

