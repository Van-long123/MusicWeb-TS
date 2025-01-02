import { Request,Response } from "express"
import Singer from "../../models/singer.model"
import Song from "../../models/song.model"
import { duration } from "../../helpers/duration"
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
        }).limit(6).select('-lyrics -rawLyrics')
        const songs=await Song.find({
            singerId:artist.id
        }).sort({
            'createdBy.createdAt':'asc'
        })
        if(songs.length<1 || songsFeatured.length<1){
            return res.redirect('/');
        }
        // forEach không chờ hoàn tất các Promise trong callback
        // rray.prototype.forEach không hỗ trợ việc xử lý bất đồng bộ 
        
        // songsFeatured.forEach(async song =>{
            // const fileDuration = await duration(song.audio);
            // song['duration']=fileDuration
        // })

        // nhưng không tối ưu nếu bạn có nhiều bài hát vì nó sẽ lặp từng thằng
        for (const song of songsFeatured) {
            const fileDuration = await duration(song.audio);
            song['duration']=fileDuration
        }

       
             

        res.render('client/pages/artists/index',{
            title:artist.fullName,
            artist:artist,
            songsFeatured:songsFeatured,
            songs:songs
        })
    } catch (error) {
        res.redirect('/')
    }
}