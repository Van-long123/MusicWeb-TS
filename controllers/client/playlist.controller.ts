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
        let songs;
        const playlist = await Playlist.findOne({
            slug:slug,
        }).select('topicId title songs')
        if(!playlist){
            res.redirect('/') 
            return;
        }
        if(playlist.topicId){
            songs=await Song.find({
                deleted:false,
                status:"active",
                topicId:playlist.topicId
            }).sort({
                listen:'desc'
            }).limit(100).select('title avatar description audio rawLyrics lyrics singerId')
        }
        else{
            songs=await Song.find({
                _id:{$in:playlist.songs},
                deleted:false,
                status:"active",
                
            }).sort({
                listen:'desc'
            }).limit(100).select('title avatar description audio rawLyrics lyrics singerId')
        }

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
                namePlaylist:playlist.title,
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

export const createPost=async  (req:Request, res:Response) => {
    try {
        if(!res.locals.user){
            res.redirect('/user/login')
            return
        }
        const countPlaylist=await Playlist.countDocuments();

        const dataPlaylist={
            title: req.body.title,
            status: 'active',
            position: countPlaylist,
            avatar:'http://res.cloudinary.com/dm5pbyp9g/image/upload/v1736554538/lmoeavv6zaewza4drjlx.png',
            createdBy:{
                user_id:res.locals.user.id,
            }
        }
        const playlist=new Playlist(dataPlaylist);
        await playlist.save()
        res.json({
            code:200,
            dataPlaylist:playlist,
            message:"Thành công!",
        })
    } catch (error) {
        res.json({
            code:400,
            message:"Lỗi!"
     
        })
    }
    
}
export const deleteItem=async  (req:Request, res:Response) => {
    try {
        if(!res.locals.user){
            res.redirect('/user/login')
            return
        }
        await Playlist.deleteOne({
            _id:req.body.id
        })
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

export const myPlaylist=async (req:Request, res:Response) => {
    try {
        if(!res.locals.user){
            res.redirect('/user/login')
            return
        }
        const myPlaylist=await Playlist.find({
            deleted:false,
            status:'active',
            'createdBy.user_id':res.locals.user.id
        }).sort({'createdBy.createdAt':'desc'}).select('title')
        res.json({
            code:200,
            myPlaylist:myPlaylist,
            message:"Thành công!",
        })
    } catch (error) {
        res.json({
            code:400,
            message:"Lỗi!",
        })
    }
}
export const addSongInPlaylist=async  (req:Request, res:Response) => {
    try {
        if(!res.locals.user){
            res.redirect('/user/login')
            return
        }
        const idPlaylist=req.params.idPlaylist
        const idSong=req.params.idSong
        const song= await Song.findOne({
            _id: idSong,
            deleted:false,
            status: 'active'
        }).select('title')
        const playlist= await Playlist.findOne({
            _id: idPlaylist,
            deleted:false,
            status: 'active',
            songs:{$ne:idSong}
        })
        if(!song){
            res.status(200).json({
                message:'Không tìm thấy bài hát',
            });
            return
        }
        if(!playlist){
            res.status(200).json({
                message:'Bài hát này đã có trong playlist',
            });
            return
        }
        playlist.songs.push(idSong)
        await playlist.save()
        res.status(200).json({
            message:`Đã thêm bài hát “${song.title}” vào playlist thành công`,
        });
    } catch (error) {
        res.json({
            code:400,
            message:"Lỗi!",
        })
    }
}