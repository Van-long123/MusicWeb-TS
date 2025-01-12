import {Request,Response} from 'express';
import FavoriteSong from '../../models/favorite-song.model';
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';
import FavoritePlaylist from '../../models/favorite-playlist.model';
import Playlist from '../../models/playlist.model';
import Topic from '../../models/topic.model';
export const index=async  (req:Request, res:Response) => {
    
    // check là đăng nhập mới vào 
    if(!res.locals.user){
        res.redirect('/user/login')
        return
    }
    const userId=res.locals.user.id;
    const favoritePlaylists=await FavoritePlaylist.find({
        userId:userId
    })
    for (const playlist of favoritePlaylists) {
        const infoPlaylist=await Playlist.findOne({
            _id:playlist.playlistId,
            status:'active',
            deleted:false,
        })
        playlist['infoPlaylist']=infoPlaylist
        const topic=await Topic.findOne({
            _id: infoPlaylist.topicId,
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
        const singers = await Singer.find({ _id: { $in: singerIds } }).select('fullName');
        const nameSinger=singers.map((item)=>{
            return item.fullName
        }).join(', ')
        playlist['nameSinger']=nameSinger
    }

    const myPlaylist=await Playlist.find({
        deleted: false,
        status:'active',
        'createdBy.user_id':res.locals.user.id
    })
    res.render('client/pages/favorite-playlists/index',{
        title:'Danh sách phát yêu thích',
        favoritePlaylists:favoritePlaylists,
        myPlaylist:myPlaylist
    })
}