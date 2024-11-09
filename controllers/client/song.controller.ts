import { Request,Response } from "express"
import Topic from "../../models/topic.model"
import Singer from "../../models/singer.model"
import Song from "../../models/song.model"
export const index= async (req: Request, res: Response)=>{
    const topic=await Topic.findOne({
        slug: req.params.slugTopic,
        status:'active',
        deleted:false,
    })
    if(!topic){
        res.redirect('back');
        return ;
    }
    const songs= await Song.find({
        topicId:topic.id,
        status:'active',
        deleted:false,
    }).select('avatar title slug singerId like')
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
            title:"Chủ đề bài hát",
            songs:songs
        }
    )
}