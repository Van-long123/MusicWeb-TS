import { Request,Response } from "express"
import Topic from "../../models/topic.model"
import Singer from "../../models/singer.model"
import Song from "../../models/song.model"
export const index=async (req: Request, res: Response)=>{
    const type:String=req.params.slug;
    let find={
        status:'active',
        deleted:false,
    }
    let sort={};
    let title:String="";
    if(type=='like'){
        sort['like']='desc'
        title="Top 30 bài hát có nhiều like nhất"
    }
    else if(type=='listen'){
        sort['listen']='desc'
        title="Top 30 bài hát có nhiều lượt nghe nhất"
    }
    else{
        const topic=await Topic.findOne({
            slug: req.params.slug,
            status:'active',
            deleted:false,
        })
        if(!topic){
            res.redirect('back');
            return ;
        }
        find['topicId']=topic.id
        title=topic.slug
    }
    const songs= await Song.find(find).sort(sort).select('avatar title slug singerId like')
    
    for (const item of songs) {
        const infoSinger=await Singer.findOne({
            _id: item.singerId,
            status:'active',
            deleted:false
        }).select('fullName')
        item['infoSinger']=infoSinger
    }
    res.render('client/pages/songs/index',
        {
            title:title,
            songs:songs
        }
    )
}

export const random=async (req: Request, res: Response)=>{
    const songsRandom=await Song.aggregate([
        {$match:{status:'active',deleted:false}},
        {$sample:{size:9}}
    ])
    for (const item of songsRandom) {
        const infoSinger=await Singer.findOne({
            _id: item.singerId,
            status:'active',
            deleted:false
        }).select('fullName')
        item['infoSinger']=infoSinger
    }
    res.json({
        code:200,
        message:'Thành công',
        songsRandom:songsRandom
    })
}