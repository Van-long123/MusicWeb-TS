import { Request,Response } from "express"
import Singer from "../../models/singer.model"
import Song from "../../models/song.model"

export const index=async(req: Request, res: Response)=>{
    try {
        const slug=req.params.slugArtist
        const artist=await Singer.findOne({
            slug:slug
        })
        // console.log(artist.fullName) //nếu mà artist null thì lỗi nó sẽ vào catch
        if(!artist){
            return res.redirect('/');
        }
        const songsFeatured=await Song.find({
            singerId:artist.id
        }).sort({
            'createdBy.createdAt':'desc'
        }).limit(6)
        const songs=await Song.find({
            singerId:artist.id
        }).sort({
            'createdBy.createdAt':'asc'
        })
        if(songs.length<1 || songsFeatured.length<1){
            return res.redirect('/');
        }

        res.render('client/pages/artists/index',{
            artist:artist,
            songsFeatured:songsFeatured,
            songs:songs
        })
    } catch (error) {
        res.redirect('/')
    }
}