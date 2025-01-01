import {Request,Response} from 'express';
import Song from '../../models/song.model';
import fillterStatusHelper from '../../helpers/fillterStatusHelper';
import search from '../../helpers/search';
import pagination from '../../helpers/paginationHelper';
import mongoose from 'mongoose';
import Topic from '../../models/topic.model';
import Singer from '../../models/singer.model';
import * as systemConfig from '../../config/system'
import Account from '../../models/account.model';
export const index=async  (req:Request, res:Response) => {
    // const permissions=res.locals.role.permissions
    // if(!permissions.includes("songs_view")){
    //     return;
    // }
    let find={
        deleted:false
    }
    let sort={
    }

    let fillterStatus=fillterStatusHelper(req.query)
    if(req.query.status){
        find['status']=req.query.status
    }

    // search 
    const objectSearch=search(req.query)
    let keyword=objectSearch.keyword
    if(req.query.keyword){
        find['$or']=[
            {title:objectSearch['keywordRegex']},
            {slug:objectSearch['slugRegex']}
        ]
    }
    // search 

    // Pagination 
    const countSongs=await Song.countDocuments(find)
    const objectPagination=pagination(req.query,countSongs,{
        currentPage:1,
        limitItems:8
    })
    // Pagination 
    if(req.query.sortKey&&req.query.sortValue){
        const sortKey=req.query.sortKey.toLocaleString()
        sort[sortKey]=req.query.sortValue
        // sort[`${req.query.sortValue}`]=req.query.sortValue
    }
    else{
        sort['position']='desc'
    }
    const songs=await Song.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)

    for (const song of songs) {
        const user=await Account.findOne({
            _id:song.createdBy.account_id
        })
        if(user) {
            song['fullName']=user.fullname
        }
        const updateBy=song.updatedBy[song.updatedBy.length-1]
        if(updateBy) {
            const user =await Account.findOne({
                _id:updateBy.account_id
            })
            if(user) {
                updateBy['accountFullName']=user.fullname
            }
        }
    }

    res.render('admin/pages/songs/index',{
        title:"Quản lý bài hát",
        songs:songs,
        fillterStatus:fillterStatus,
        keyword:keyword,
        pagination:objectPagination
    })
}
export const changeStatus=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("songs_edit")){
        return;
    }
    const idSong:string = req.params.idSong
    const status:string = req.params.status
    // const updatedBy={
    //     account_id:String,
    //     updatedAt:new Date()
    // }
    await Song.updateOne({
        _id:idSong
    },{
        status:status
    })
    req.flash('success', 'Cập nhật trạng thái bài hát thành công');
    res.redirect('back');
}
export const deleteItem=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("songs_delete")){
        return;
    }
    const id=req.params.idSong
    const deletedBy={
        account_id:res.locals.user.id,
        deletedAt:new Date()
    };
    await Song.updateOne({
        _id:id
    },{
        deleted:true,deletedBy:deletedBy
    })
    req.flash('success','Đã xóa bài hát thành công')
    res.redirect('back')
}

export const changeMulti=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("songs_edit")){
        return;
    }
    const type=req.body.type;
    // console.log(req.body.ids.split(','))//phải lượt qua từng phần tử để cắt bỏ đi 2 đầu khoảng trắng nó mới đc
    let ids: string[] = req.body.ids.split(',').map((id:string) => id.trim());
    switch(type) {
        case 'active':
            await Song.updateMany({
                _id:{$in:ids}
            },{
                status:'active'
            })
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} bài hát`);
            break;
        case 'inactive':
            await Song.updateMany(
                { _id: { $in: ids } }, // Điều kiện tìm kiếm các bài hát có id trong mảng ids
                { status: 'inactive' }  // Cập nhật status thành 'inactive'
            );
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} bài hát`);
            break;
        case 'delete-all':
            await Song.updateMany({
                _id:{$in:ids}
            },{
                deleted:true
            })
            req.flash('success', `Xóa thành công ${ids.length} bài hát`);
            break;
        case 'change-position':
            for (const item of ids) {
                let value=item.split('-')
                const id:string = value[0]
                const position:number = parseInt(value[1])
                await Song.updateOne({
                    _id:id
                },{
                    position:position
                })
            }
            req.flash('success', `Đổi vị trí thành công ${ids.length} bài hát`);
            break;
    }   
    res.redirect('back')
}

export const create=async  (req:Request, res:Response) => {
    const topics=await Topic.find({
        deleted:false
    }).select('title')
    const singers=await Singer.find({
        deleted:false 
    }).select('fullName')
    res.render('admin/pages/songs/create',{
        title:"Thêm bài hát mới",
        topics:topics,
        singers:singers
    })
}
export const createPost=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("songs_create")){
        return;
    }
    let avatar='';
    let audio='';
    if(req.body.avatar){
        avatar=req.body.avatar[0]
    }
    if(req.body.audio){
        audio=req.body.audio[0]
    }
    if(req.body.position){
        req.body.position=parseInt(req.body.position)
    }
    else{
        const countSong=await Song.countDocuments();
        req.body.position=countSong+1
    }
    const dataSong={
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        status: req.body.status,
        lyrics:req.body.lyrics,
        rawLyrics:req.body.rawLyrics,
        position: req.body.position,
        avatar: avatar,
        audio: audio
    }
    const createdBy={
        account_id:res.locals.user.id,
    }
    dataSong['createdBy']=createdBy
    const song=new Song(dataSong)
    await song.save();
    req.flash('success', `Đã thêm thành công bài hát`);
    res.redirect(`${systemConfig.prefixAdmin}/songs`);
}
export const edit=async  (req:Request, res:Response) => {
    try {
        const id=req.params.id;
        const song=await Song.findOne({
            _id:id
        })
        const topics=await Topic.find({
            deleted:false
        }).select('title')
        const singers=await Singer.find({
            deleted:false 
        }).select('fullName')
        res.render('admin/pages/songs/edit',{
            title:"Cập nhật bài hát mới",
            song:song,
            topics:topics,
            singers:singers
        })
    } catch (error) {
        
    }
    
}
export const editPost=async  (req:Request, res:Response) => {
    const permissions=res.locals.role.permissions
    if(!permissions.includes("songs_edit")){
        return;
    }
    try {
        const id = req.params.id;
        if(req.body.position){
            req.body.position=parseInt(req.body.position)
        }
        else{
            const countSong=await Song.countDocuments();
            req.body.position=countSong+1
        }
        const dataSong={
            title: req.body.title,
            topicId: req.body.topicId,
            singerId: req.body.singerId,
            description: req.body.description,
            status: req.body.status,
            lyrics:req.body.lyrics,
            rawLyrics:req.body.rawLyrics,
            position: req.body.position,
        }
        if(req.body.avatar){
            dataSong['avatar']=req.body.avatar[0]
        }
        if(req.body.audio){
            dataSong['audio']=req.body.audio[0]
        }

        const updatedBy={
            account_id:res.locals.user.id,
            updatedAt:new Date()
        }
        await Song.updateOne({
            _id:id
        },{...dataSong,$push:{updatedBy:updatedBy}});
        req.flash('success', `Cập nhật thành công bài hát`);
        res.redirect(`back`)
    } catch (error) {
        
    }
    
}
export const detail=async  (req:Request, res:Response) => {
    try {
        const id=req.params.id;
        const song=await Song.findOne({
            _id:id
        })
        const topic=await Topic.findOne({
            _id:song.topicId,
            deleted:false
        }).select('title')
        const singer=await Singer.findOne({
            _id:song.singerId,
            deleted:false 
        }).select('fullName')
        res.render('admin/pages/songs/detail',{
            title:"Chi tiết bài hát",
            song:song,
            topic:topic,
            singer:singer
        })
    } catch (error) {
        
    }
    
}