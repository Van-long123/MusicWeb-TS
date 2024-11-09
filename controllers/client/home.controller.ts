import { Request,Response } from "express"
import Topic from "../../models/topic.model"
import Song from "../../models/song.model"
import Singer from "../../models/singer.model"

export const index=async (req:Request, res:Response) => {
    const topics= await Topic.find({
        status:'active',
        deleted:false,
    }).limit(4)
    const songsRandom=await Song.aggregate([
        {$match:{status:'active',deleted:false}},
        {$sample:{size:12}}
    ])
    for (const item of songsRandom) {
        const infoSinger=await Singer.findOne({
            _id: item.singerId,
            status:'active',
            deleted:false
        }).select('fullName')
        item['infoSinger']=infoSinger
    }

    const songsLike= await Song.find({
        status:'active',
        deleted:false,
    }).limit(4).sort({like:'desc'}).select('avatar title slug singerId like')
    for (const item of songsLike) {
        const infoSinger=await Singer.findOne({
            _id: item.singerId,
            status:'active',
            deleted:false
        }).select('fullName')
        item['infoSinger']=infoSinger
    }
    const songsListen= await Song.find({
        status:'active',
        deleted:false,
    }).limit(4).sort({listen:'desc'}).select('avatar title slug singerId like')
    for (const item of songsListen) {
        const infoSinger=await Singer.findOne({
            _id: item.singerId,
            status:'active',
            deleted:false
        }).select('fullName')
        item['infoSinger']=infoSinger
    }
    res.render('client/pages/home/index',
        {
            title:"Trang chủ",
            topics:topics,
            songsLike:songsLike,
            songsListen:songsListen,
            songsRandom:songsRandom
        }
    )
}