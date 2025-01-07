import { Request,Response } from "express"
import Topic from "../../models/topic.model"
import Song from "../../models/song.model"
import Singer from "../../models/singer.model"
import Playlist from "../../models/playlist.model"

export const index=async (req:Request, res:Response) => {
    const topics= await Topic.find({
        status:'active',
        deleted:false,
    }).limit(6)
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

    // const songsLike= await Song.find({
    //     status:'active',
    //     deleted:false,
    // }).limit(4).sort({like:'desc'}).select('avatar title slug singerId like')
    // for (const item of songsLike) {
    //     const infoSinger=await Singer.findOne({
    //         _id: item.singerId,
    //         status:'active',
    //         deleted:false
    //     }).select('fullName')
    //     item['likeCount']= item.like.length; 
    //     item['infoSinger']=infoSinger
    // }

    const songs= await Song.find({
        status:'active',
        deleted:false,
    }).limit(4).select('avatar title slug singerId like')
    for (const item of songs) {
        const infoSinger=await Singer.findOne({
            _id: item.singerId,
            status:'active',
            deleted:false
        }).select('fullName')
        item['likeCount']= item.like.length; 
        item['infoSinger']=infoSinger
    }


    const playlists=await Playlist.find({
        status:'active',
        deleted:false,
    })
    
    for (const item of playlists) {
        const topic=await Topic.findOne({
            _id: item.topicId,
        })
        const songs = await Song.aggregate([
            {
                $match: {
                    topicId: topic.id // Lọc theo topicId
                }
            },
            {
                $sort:{ listen: -1 } // Sắp xếp theo singerId tăng dần (1 là tăng dần, -1 là giảm dần)
            },
            {
                $group: {
                    _id: "$singerId" // Nhóm theo singerId để loại bỏ trùng lặp
                }
            },
            {
                $limit: 6 // Lấy 3 giá trị đầu tiên
            }
        ]);
        const singerIds = songs.map(song => song._id);
        // let singers=[]
        // for (const song of songs) {
        //     const singer=await Singer.findOne({
        //         _id: song._id
        //     }).select('fullName')
        //     singers.push(singer)
        // }
        const singers = await Singer.find({ _id: { $in: singerIds } }).select('fullName');
        const nameSinger=singers.map((item)=>{
            return item.fullName
        }).join(', ')
        item['nameSinger']=nameSinger
    }   
    res.render('client/pages/home/index',
        {
            title:"Trang chủ",
            topics:topics,
            playlists:playlists,
            songs:songs,
            songsRandom:songsRandom
        }
    )
}