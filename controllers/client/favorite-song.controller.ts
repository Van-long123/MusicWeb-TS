import {Request,Response} from 'express';
import FavoriteSong from '../../models/favorite-song.model';
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';
export const index=async  (req:Request, res:Response) => {
    
    // check là đăng nhập mới vào 
    const userId=res.locals.user.id;
    const favoriteSongs=await FavoriteSong.find({
        userId:userId
    })
    for (const song of favoriteSongs) {
        const infoSong=await Song.findOne({
            _id:song.songId,
            deleted:false,
            status:'active'
        })
        infoSong['likeCount']= infoSong.like.length; 
        song['infoSong']=infoSong
        const infoSinger=await Singer.findOne({
            _id: infoSong.singerId,
            deleted:false,
            status:'active'
        }).select('fullName')
        song['infoSinger']=infoSinger
    }
    res.render('client/pages/favorite-songs/index',{
        title:'Bài hát yêu thích',
        favoriteSongs:favoriteSongs
    })
}