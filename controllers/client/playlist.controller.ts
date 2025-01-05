import { Request,Response } from "express"
import Song from "../../models/song.model"
import Singer from "../../models/singer.model"
export const index=async (req: Request, res: Response)=>{
    const songs=await Song.find({
        deleted:false,
        status:"active"
    }).limit(4).select('title avatar description audio rawLyrics lyrics singerId')
    let singers=[]
    for (const song of songs) {
        const singer= await Singer.findOne({
            _id: song.singerId,
            status:'active',
            deleted:false
        }).select('fullName')
        singers.push(singer.fullName)
    }
    res.render('client/pages/playlists/index',
        {
            songs:songs,
            singers:singers
        }
    )
  
}
