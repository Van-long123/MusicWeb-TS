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
        item['likeCount']= item.like.length; 

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


export const detail=async (req: Request, res: Response)=>{
    const slugSong:string=req.params.slugSong;
    const song=await Song.findOne({
        slug:slugSong,
        deleted:false,
        status:"active"
    })
    song['likeCount']= song.like.length; 
    
    const singer= await Singer.findOne({
        _id: song.singerId,
        status:'active',
        deleted:false
    }).select('fullName')
    const topic=await Topic.findOne({
        _id: song.topicId,
        status:'active',
        deleted:false
    }).select('title')


    song['isLikeSong']=song['like'].some(item=>{
        return item==res.locals.user.id
    })
    res.render('client/pages/songs/detail',{
        title:slugSong,
        song:song,
        singer:singer,
        topic:topic,
    })
}
export const listen=async (req: Request, res: Response)=>{
    try {
        const idSong:string=req.params.idSong;
        const song=await Song.findOne({
            _id: idSong,
            deleted:false,
            status:"active"
        })
        const listen=song.listen+1;
        await Song.updateOne({
            _id:idSong,
            deleted:false,
            status:"active"
        },
        {
            listen:listen
        })
        res.json({
            code:200,
            message:'Thành công',
            listen:listen
        })
    } catch (error) {
        res.json({
            code:400,
            message:'Lỗi!',
        })
    }
}
export const like=async (req: Request, res: Response)=>{
    try {
        const typeLike:string=req.params.typeLike
        const idSong:string=req.params.idSong
        const song=await Song.findOne({
            _id:idSong,
            deleted:false,
            status:"active"
        })
        if(!song){
            res.json({
                code:400,
                message:"Lỗi!"
         
            })
        }
        const newLike=typeLike=="like" ? song['like'].length+1 :song['like'].length-1;

        if(typeLike=="like"){
            await Song.updateOne({
                _id:idSong,
                deleted:false,
                status:"active"
            },{
                $push:{like:res.locals.user.id}
            })
            // console.log()
        }
        else{
            await Song.updateOne({
                _id:idSong,
                deleted:false,
                status:"active"
            },{
                $pull:{like:res.locals.user.id}
            })
        }
        res.json({
            code:200,
            message:"Thành công!",
            like:newLike
        })
    } catch (error) {
        res.json({
            code:400,
            message:"Lỗi!"
     
        })
    }
    
}


