import {Request,Response} from 'express';
import Role from '../../models/role.model';
import fillterStatusHelper from '../../helpers/fillterStatusHelper';
import search from '../../helpers/search';
import pagination from '../../helpers/paginationHelper';
import * as systemConfig from '../../config/system'
import Topic from '../../models/topic.model';
import Singer from '../../models/singer.model';
import Account from '../../models/account.model';
export const index=async  (req:Request, res:Response) => {
    // const permissions=res.locals.role.permissions
    // if(!permissions.includes("singers_view")){
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
    // sort 
    // if(req.query.sortKey&&req.query.sortValue){
    //     const sortKey=req.query.sortKey.toLocaleString()
    //     sort[sortKey]=req.query.sortValue
    // }
    
    // sort 

    const singers=await Singer.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)

    for (const singer of singers) {
        const user=await Account.findOne({
            _id:singer.createdBy.account_id
        })
        if(user) {
            singer['fullNameAccount']=user.fullname
        }
        const updateBy=singer.updatedBy[singer.updatedBy.length-1]
        if(updateBy) {
            const user =await Account.findOne({
                _id:updateBy.account_id
            })
            if(user) {
                updateBy['accountFullName']=user.fullname
            }
        }
    }

    res.render('admin/pages/singers/index',{
        title:"Quản lý ca sĩ",
        singers:singers,
        fillterStatus:fillterStatus,
        keyword:keyword,
        pagination:objectPagination
    })
}
export const changeStatus=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("singers_edit")){
        return;
    }
    const status=req.params.status
    const id=req.params.id
    // const updatedBy={
    //     account_id:String,
    //     updatedAt:new Date()
    // }
    await Singer.updateOne({
        _id:id
    },{
        status:status
    })
    req.flash('success', 'Cập nhật trạng thái ca sĩ thành công');
    res.redirect('back');
}
export const deleteItem=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("singers_delete")){
        return;
    }
    const id=req.params.id
    const deletedBy={
        account_id:res.locals.user.id,
        deletedAt:new Date()
    };
    await Singer.updateOne({
        _id:id
    },{
        deleted:true,deletedBy:deletedBy
    })
    req.flash('success','Đã xóa ca sĩ thành công')
    res.redirect('back')
}


export const changeMulti=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("singers_edit")){
        return;
    }
    const type=req.body.type
    let ids: string[] = req.body.ids.split(',').map((id:string) => id.trim());

    // let ids:string[]=req.body.ids.split(',').map((id:string)=>{return id.trim()})
    switch (type) {
        case 'active':
            await Singer.updateMany({
                _id:{$in:ids}
            },{
                status:'active'
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} ca sĩ`);
            break;
        case 'inactive':
            await Singer.updateMany({
                _id:{$in:ids}
            },{
                status:'inactive'
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} ca sĩ`);
            break;
        case 'delete-all':
            await Singer.updateMany({
                _id:{$in:ids}
            },{
                deleted:true
            })
            req.flash('success', `Xóa thành công ${ids.length} ca sĩ`);
            break;
    }
    res.redirect('back')
}
export const create=async  (req:Request, res:Response) => {
    res.render('admin/pages/singers/create',{
        title:"Thêm ca sĩ mới",
    })
}
export const createPost=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("singers_create")){
        return;
    }
    const createdBy={
        account_id:res.locals.user.id,
    }
    req.body.createdBy=createdBy
    const singer=new Singer(req.body);
    singer.save()
    req.flash('success', `Đã thêm thành công ca sĩ`);
    res.redirect(`${systemConfig.prefixAdmin}/singers`);
}

export const edit=async  (req:Request, res:Response) => {
    try {
        const singer=await Singer.findOne({
            _id:req.params.id
        })
        res.render('admin/pages/singers/edit',{
            title:"Thêm ca sĩ mới",
            singer:singer
        })
    } catch (error) {
        
    }
}
export const editPatch=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("singers_edit")){
        return;
    }
    const updatedBy={
        account_id:res.locals.user.id,
        updatedAt:new Date()
    }
    await Singer.updateOne({_id:req.params.id},{...req.body,$push:{updatedBy:updatedBy}});
    req.flash('success', `Cập nhật thành công ca sĩ`);
    res.redirect(`back`);
}

export const detail=async  (req:Request, res:Response) => {
    try {
        
        const topic=await Topic.findOne({
            _id:req.params.id,
            deleted:false
        })
        res.render('admin/pages/topics/detail',{
            title:"Cập nhật hát mới",
            topic:topic,
        })
    } catch (error) {
        
    }
    
}