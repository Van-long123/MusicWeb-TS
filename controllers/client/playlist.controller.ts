import { Request,Response } from "express"
import Song from "../../models/song.model"
import Singer from "../../models/singer.model"
import Playlist from "../../models/playlist.model"
import Topic from "../../models/topic.model"
import pagination from "../../helpers/paginationHelper"
import FavoritePlaylist from "../../models/favorite-playlist.model"
export const index=async (req: Request, res: Response)=>{
    let find={
        status:'active',
        deleted:false,
    }
    const countPlaylist=await Playlist.countDocuments(find)
    const objectPagination=pagination(req.query, countPlaylist, {
        currentPage: 1,
        limitItems: 12,  // Hiển thị 8 bài hát mỗi trang
    });
    const playlists=await Playlist.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)
    
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
        item['nameSinger']=nameSinger
    }   
    res.render('client/pages/playlists/index',
        {
            title:"Top 100 | Tuyển tập nhạc hay chọn lọc",
            playlists:playlists,
            pagination:objectPagination
        }
    )
}
export const detail=async (req: Request, res: Response)=>{
    try {
        const slug=req.params.slug
        const playlist = await Playlist.findOne({
            slug:slug,
        }).select('topicId')
        if(!playlist){
            res.redirect('/') 
            return;
        }

        const songs=await Song.find({
            deleted:false,
            status:"active",
            topicId:playlist.topicId
        }).sort({
            listen:'desc'
        }).limit(100).select('title avatar description audio rawLyrics lyrics singerId')
        let singers=[]
        for (const song of songs) {
            const singer= await Singer.findOne({
                _id: song.singerId,
                status:'active',
                deleted:false
            }).select('fullName')
            singers.push(singer.fullName)
        }
        res.render('client/pages/playlists/detail',
            {
                title:slug,
                songs:songs,
                singers:singers
            }
        )
    } catch (error) {
        res.redirect('/')   
    }
  
}


export const favorite=async (req: Request, res: Response)=>{
    try {
        const idPlaylist=req.params.idPlaylist
        const typeFavorite=req.params.typeFavorite
        const userId=res.locals.user.id
        console.log(idPlaylist)
        console.log(typeFavorite)
        switch (typeFavorite) {
            case 'favorite':
                const playlistFavorite=await FavoritePlaylist.findOne({
                    playlistId:idPlaylist,
                    userId:userId,
                })
                if(!playlistFavorite){
                    const record=new FavoritePlaylist({
                        playlistId:idPlaylist,
                        userId:userId,
                    });
                    await record.save()
                }
                break;
            case 'unFavorite':
                const isSongFavorite=await FavoritePlaylist.findOne({
                    playlistId:idPlaylist,
                    userId:userId,
                })
                if(isSongFavorite){
                    await FavoritePlaylist.deleteOne({
                        playlistId:idPlaylist,
                        userId:userId,
                    })
                }
                break;
            default:
                res.json({
                    code:400,
                    message:'Lỗi !'
                })
                break;
        }
        res.json({
            code:200,
            message:"Thành công!",
        })
    } catch (error) {
        res.json({
            code:400,
            message:"Lỗi!"
     
        })
    }
    
}