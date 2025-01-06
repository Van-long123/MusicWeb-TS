import {Request,Response} from 'express';
import Playlist from '../../models/playlist.model';
import fillterStatusHelper from '../../helpers/fillterStatusHelper';
import search from '../../helpers/search'; 
import pagination from '../../helpers/paginationHelper';
import Account from '../../models/account.model';
import Topic from '../../models/topic.model';
import * as systemConfig from '../../config/system'

export const index=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("playlists_view")){
        return;
    }
    let find={
        deleted:false
    }
    let sort={}
    let fillterStatus=fillterStatusHelper(req.query)
    if(req.query.status){
        find['status']=req.query.status
    }
    const objectSearch=search(req.query)
    if(req.query.keyword){
        find['$or']=[
            {title:objectSearch['keywordRegex']},
            {slug:objectSearch['slugRegex']}
        ]
    }

    const countPlaylist=await Playlist.countDocuments(find)
    const objectPagination=pagination(req.query,countPlaylist,{
        currentPage:1,
        limitItems:8
    })
    if(req.query.sortKey&&req.query.sortValue){
        const sortKey=req.query.sortKey.toString()
        sort[sortKey]=req.query.sortValue
    }
    const playlists=await Playlist.find(find)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .sort(sort)
    for (const playlist of playlists) {
        const user=await Account.findOne({
            _id:playlist.createdBy.account_id
        })
        if(user) {
            playlist['fullName']=user.fullname
        }
        const updateBy=playlist.updatedBy[playlist.updatedBy.length-1]
        if(updateBy) {
            const user =await Account.findOne({
                _id:updateBy.account_id
            })
            if(user) {
                updateBy['accountFullName']=user.fullname
            }
        }
    }
    res.render('admin/pages/playlists/index',{
        title:"Quản lý danh sách phát",
        playlists:playlists,
        fillterStatus:fillterStatus,
        pagination:objectPagination,
        keyword:objectSearch.keyword
    })
}
export const changeStatus=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("playlists_edit")){
        return;
    }
    const status=req.params.status
    const id=req.params.id
    const updatedBy={
        account_id:res.locals.user.id,
        updatedAt:new Date()
    }
    await Playlist.updateOne({
        _id:id,
    },{
        status:status,$push:{updatedBy:updatedBy}
    })
    req.flash('success', 'Cập nhật trạng thái danh sách phát thành công');
    res.redirect('back');
}
export const deleteItem=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("playlists_delete")){
        return;
    }
    const id=req.params.id
    const deletedBy={
        account_id:res.locals.user.id,
        deletedAt:new Date()
    }
    await Playlist.updateOne({
        _id:id,
    },{
        deleted:true,
        deletedBy:deletedBy
    })
    req.flash('success','Đã xóa danh sách phát thành công')
    res.redirect('back')
}
export const changeMulti=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("playlists_edit")){
        return;
    }
    const type=req.body.type;
    let ids:string[]=req.body.ids.split(',').map((id:string)=>id.trim());
    const updatedBy={
        account_id:res.locals.user.id,
        updatedAt:new Date()
    }
    switch(type) {
        case 'active':
            await Playlist.updateMany({
                _id:{$in:ids}
            },{
                status:'active',$push:{updatedBy:updatedBy}
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} danh sách phát`);
            break;
        case 'inactive':
            await Playlist.updateMany(
                { _id: { $in: ids } }, // Điều kiện tìm kiếm các danh sách phát có id trong mảng ids
                { status: 'inactive',$push:{updatedBy:updatedBy} }  // Cập nhật status thành 'inactive'
            );
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} danh sách phát`);
            break;
        case 'delete-all':
            const deletedBy={
                account_id:res.locals.user.id,
                deletedAt:new Date()
            }
            await Playlist.updateMany({
                _id:{$in:ids}
            },{
                deleted:true,deletedBy:deletedBy
            })
            req.flash('success', `Xóa thành công ${ids.length} danh sách phát`);
            break;
        case 'change-position':
            for (const item of ids) {
                let value=item.split('-')
                const id:string = value[0]
                const position:number = parseInt(value[1])
                await Playlist.updateOne({
                    _id:id
                },{
                    position:position,$push:{updatedBy:updatedBy}
                })
            }
            req.flash('success', `Đổi vị trí thành công ${ids.length} danh sách phát`);
            break;
    }   
    res.redirect('back')
}
export const detail=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("playlists_view")){
        return;
    }
    try {
        const id=req.params.id;
        const playlist=await Playlist.findOne({
            _id:id
        })
        const topic=await Topic.findOne({
            _id:playlist.topicId,
            deleted:false
        }).select('title')
        
        res.render('admin/pages/playlists/detail',{
            title:"Chi tiết danh sách phát",
            topic:topic,
            playlist:playlist
        })
    } catch (error) {
        res.redirect('/')
    }
}


export const create=async  (req:Request, res:Response) => {
    const topics=await Topic.find({
        deleted:false
    }).select('title')
    res.render('admin/pages/playlists/create',{
        title:"Thêm danh sách phát mới",
        topics:topics,
    })
}
export const createPost=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("playlists_create")){
        return;
    }
    if(req.body.position){
        req.body.position=parseInt(req.body.position)
    }
    else{
        const playlistCount=await Playlist.countDocuments();
        req.body.position=playlistCount+1
    }
    const createdBy={
        account_id:res.locals.user.id,
    }
    req.body.createdBy=createdBy
    const playlist=new Playlist(req.body);
    playlist.save()
    req.flash('success', `Đã thêm thành công danh sách phát`);
    res.redirect(`${systemConfig.prefixAdmin}/playlists`);
}

export const edit=async  (req:Request, res:Response) => {
    try {
        const id=req.params.id;
        const playlist=await Playlist.findOne({
            _id:id
        })
        const topics=await Topic.find({
            deleted:false
        }).select('title')
        res.render('admin/pages/playlists/edit',{
            title:"Cập nhật danh sách phát",
            topics:topics,
            playlist:playlist
        })
    } catch (error) {
        
    }
    
}
export const editPatch=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("playlists_edit")){
        return;
    }
    try {
        const id = req.params.id;
        if(req.body.position){
            req.body.position=parseInt(req.body.position)
        }
        else{
            const countPlaylist=await Playlist.countDocuments();
            req.body.position=countPlaylist+1
        }
        const dataSong={
            title: req.body.title,
            topicId: req.body.topicId,
            description: req.body.description,
            status: req.body.status,
            position: req.body.position,
            avatar:req.body.avatar
        }
        const updatedBy={
            account_id:res.locals.user.id,
            updatedAt:new Date()
        }
        await Playlist.updateOne({
            _id:id
        },{...dataSong,$push:{updatedBy:updatedBy}});
        req.flash('success', `Cập nhật thành công danh sách phát`);
        res.redirect(`back`)
    } catch (error) {
        
    }
    
}