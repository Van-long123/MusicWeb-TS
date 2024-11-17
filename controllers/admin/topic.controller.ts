import {Request,Response} from 'express';
import Role from '../../models/role.model';
import fillterStatusHelper from '../../helpers/fillterStatusHelper';
import search from '../../helpers/search';
import pagination from '../../helpers/paginationHelper';
import * as systemConfig from '../../config/system'
import Topic from '../../models/topic.model';
import Account from '../../models/account.model';
export const index=async  (req:Request, res:Response) => {
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
    const countTopics=await Topic.countDocuments(find)
    const objectPagination=pagination(req.query,countTopics,{
        currentPage:1,
        limitItems:8
    })
    //pagination
    // sort 
    if(req.query.sortKey&&req.query.sortValue){
        const sortKey=req.query.sortKey.toLocaleString()
        sort[sortKey]=req.query.sortValue
    }
    else{
        sort['position']="desc"
    }
    // sort 

    const topics=await Topic.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)

    for (const topic of topics) {
        const user=await Account.findOne({
            _id:topic.createdBy.account_id
        })
        if(user) {
            topic['fullName']=user.fullname
        }
        const updateBy=topic.updatedBy[topic.updatedBy.length-1]
        if(updateBy) {
            const user =await Account.findOne({
                _id:updateBy.account_id
            })
            if(user) {
                updateBy['accountFullName']=user.fullname
            }
        }
    }

    res.render('admin/pages/topics/index',{
        title:"Quản lý chủ đề",
        topics:topics,
        fillterStatus:fillterStatus,
        keyword:keyword,
        pagination:objectPagination
    })
}
export const changeStatus=async  (req:Request, res:Response) => {
    const status=req.params.status
    const id=req.params.id
    // const updatedBy={
    //     account_id:String,
    //     updatedAt:new Date()
    // }
    await Topic.updateOne({
        _id:id
    },{
        status:status
    })
    req.flash('success', 'Cập nhật trạng thái chủ đề thành công');
    res.redirect('back');
}
export const deleteItem=async  (req:Request, res:Response) => {
    const id=req.params.id
    const deletedBy={
        account_id:res.locals.user.id,
        deletedAt:new Date()
    };
    await Topic.updateOne({
        _id:id
    },{
        deleted:true,deletedBy:deletedBy
    })
    
    req.flash('success','Đã xóa chủ đề thành công')
    res.redirect('back')
}


export const changeMulti=async  (req:Request, res:Response) => {
    const type=req.body.type
    let ids: string[] = req.body.ids.split(',').map((id:string) => id.trim());

    // let ids:string[]=req.body.ids.split(',').map((id:string)=>{return id.trim()})
    switch (type) {
        case 'active':
            await Topic.updateMany({
                _id:{$in:ids}
            },{
                status:'active'
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} chủ đề`);
            break;
        case 'inactive':
            await Topic.updateMany({
                _id:{$in:ids}
            },{
                status:'inactive'
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} chủ đề`);
            break;
        case 'delete-all':
            await Topic.updateMany({
                _id:{$in:ids}
            },{
                deleted:true
            })
            req.flash('success', `Xóa thành công ${ids.length} chủ đề`);
            break;
        case 'change-position':
            for (const item of ids) {
                let value=item.split('-')
                const id:string=value[0]
                const position:string=value[1]
                await Topic.updateOne({
                    _id:id
                },{
                    position:position
                })
            }
            req.flash('success', `Đổi vị trí thành công ${ids.length} chủ đề`);
            break;
    }
    res.redirect('back')
}
export const create=async  (req:Request, res:Response) => {
    res.render('admin/pages/topics/create',{
        title:"Thêm chủ đề mới",
    })
}
export const createPost=async  (req:Request, res:Response) => {
    if(req.body.position){
        req.body.position=parseInt(req.body.position)
    }
    else{
        const topicCount=await Topic.countDocuments();
        req.body.position=topicCount+1
    }
    const createdBy={
        account_id:res.locals.user.id,
    }
    req.body.createdBy=createdBy
    const topic=new Topic(req.body);
    topic.save()
    req.flash('success', `Đã thêm thành công chủ đề`);
    res.redirect(`${systemConfig.prefixAdmin}/topics`);
}

export const edit=async  (req:Request, res:Response) => {
    try {
        const topic=await Topic.findOne({
            _id:req.params.id
        })
        res.render('admin/pages/topics/edit',{
            title:"Cập nhật chủ đề",
            topic:topic
        })
    } catch (error) {
        
    }
}
export const editPatch=async  (req:Request, res:Response) => {
    if(req.body.position){
        req.body.position=parseInt(req.body.position)
    }
    else{
        const topicCount=await Topic.countDocuments();
        req.body.position=topicCount+1
    }
    const updatedBy={
        account_id:res.locals.user.id,
        updatedAt:new Date()
    }

    await Topic.updateOne({_id:req.params.id},{...req.body,$push:{updatedBy:updatedBy}});
    req.flash('success', `Cập nhật thành công chủ đề`);
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