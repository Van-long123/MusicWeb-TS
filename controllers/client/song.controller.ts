import { Request,Response } from "express"
import Topic from "../../models/topic.model"
import Singer from "../../models/singer.model"
import Song from "../../models/song.model"
import pagination from '../../helpers/paginationHelper';

import FavoriteSong from "../../models/favorite-song.model"
import ListenHistory from "../../models/listen-history.model"
import axios from "axios";
import path from 'path'
export const index=async (req: Request, res: Response)=>{
    try {
        let find={
            status:'active',
            deleted:false,
        }

        // const songsLimited = await Song.find(find)
        // .limit(20)
        // .select('avatar title slug singerId like')

        // // / pagination cho 20 bài hát đã lấy
        // const countSongs = songsLimited.length;
        // const objectPagination = pagination(req.query, countSongs, {
        //     currentPage: 1,
        //     limitItems: 16,  // Hiển thị 8 bài hát mỗi trang
        // });

        // // Phân trang trên tập 20 bài hát đã lấy
        // //0-15  16-35
        // const songs = songsLimited.slice(objectPagination.skip, objectPagination.skip + objectPagination.limitItems);

        const countSongs = await Song.countDocuments(find);
        const objectPagination = pagination(req.query, countSongs, {
            currentPage: 1,
            limitItems: 16,  // Hiển thị 8 bài hát mỗi trang
        });

        const songs =await Song.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)

        for (const item of songs) {
            const infoSinger=await Singer.findOne({
                _id: item.singerId,
                status:'active',
                deleted:false
            }).select('fullName')
            item['likeCount']= item.like.length; 

            item['infoSinger']=infoSinger
        }
        res.render('client/pages/songs/index',
            {
                title:'Tất cả các bài hát',
                songs:songs,
                pagination:objectPagination
            }
        )
    } catch (error) {
        res.redirect('/')
    }
}

export const random=async (req: Request, res: Response)=>{
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
    res.json({
        code:200,
        message:'Thành công',
        songsRandom:songsRandom
    })
}


export const detail=async (req: Request, res: Response)=>{
    try {
        const slugSong:string=req.params.slugSong;
        const song=await Song.findOne({
            slug:slugSong,
            deleted:false,
            status:"active"
        })
        song['likeCount']= song.like.length; 
        
        const singer= await Singer.findOne({
            _id: song.singerId,
            status:'active',
            deleted:false
        }).select('fullName')
        const topic=await Topic.findOne({
            _id: song.topicId,
            status:'active',
            deleted:false
        }).select('title')

        if(res.locals.user){
            // if(res.locals.user.id){ sẽ báo lỗi vì user nó undefinded thì trỏ tới id sẽ lỗi 
            // vì vậy chỉ nên res.locals.user 
            const isFavoriteSong=await FavoriteSong.findOne({
                userId:res.locals.user.id,
                songId:song.id
            })
            song['isFavoriteSong']=isFavoriteSong ? true : false
            song['isLikeSong']=song['like'].some(item=>{
                return item==res.locals.user.id
            })
        }
        
        // listenhistory 
        if(res.locals.user){
            const existHistory=await ListenHistory.findOne({
                userId: res.locals.user.id,     
                songId: song.id,      
            })
            if(!existHistory){
                const listenHistory=new ListenHistory({
                    userId: res.locals.user.id,     
                    songId: song.id,      
                })
                await listenHistory.save()
            }
            
        }
        
        // listenhistory 

        res.render('client/pages/songs/detail',{
            title:slugSong,
            song:song,
            singer:singer,
            topic:topic,
        })
    } catch (error) {
        res.redirect('/')
    }
}
export const listen=async (req: Request, res: Response)=>{
    try {
        const idSong:string=req.params.idSong;
        const song=await Song.findOne({
            _id: idSong,
            deleted:false,
            status:"active"
        })
        const listen=song.listen+1;
        await Song.updateOne({
            _id:idSong,
            deleted:false,
            status:"active"
        },
        {
            listen:listen
        })
        res.json({
            code:200,
            message:'Thành công',
            listen:listen
        })
    } catch (error) {
        res.json({
            code:400,
            message:'Lỗi!',
        })
    }
}
export const like=async (req: Request, res: Response)=>{
    try {
        const typeLike:string=req.params.typeLike
        const idSong:string=req.params.idSong
        const song=await Song.findOne({
            _id:idSong,
            deleted:false,
            status:"active"
        })
        if(!song){
            res.json({
                code:400,
                message:"Lỗi!"
         
            })
        }
        const newLike=typeLike=="like" ? song['like'].length+1 :song['like'].length-1;

        if(typeLike=="like"){
            await Song.updateOne({
                _id:idSong,
                deleted:false,
                status:"active"
            },{
                $push:{like:res.locals.user.id}
            })
            // console.log()
        }
        else{
            await Song.updateOne({
                _id:idSong,
                deleted:false,
                status:"active"
            },{
                $pull:{like:res.locals.user.id}
            })
        }
        res.json({
            code:200,
            message:"Thành công!",
            like:newLike
        })
    } catch (error) {
        res.json({
            code:400,
            message:"Lỗi!"
     
        })
    }
    
}


export const favorite=async (req: Request, res: Response)=>{
    try {
        const idSong=req.params.idSong
        const typeFavorite=req.params.typeFavorite
        const userId=res.locals.user.id
        switch (typeFavorite) {
            case 'favorite':
                const songFavorite=await FavoriteSong.findOne({
                    songId:idSong,
                    userId:userId,
                })
                if(!songFavorite){
                    const record=new FavoriteSong({
                        songId:idSong,
                        userId:userId,
                    });
                    await record.save()
                }
                break;
            case 'unFavorite':
                const isSongFavorite=await FavoriteSong.findOne({
                    songId:idSong,
                    userId:userId,
                })
                if(isSongFavorite){
                    await FavoriteSong.deleteOne({
                        songId:idSong,
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




export const download=async (req: Request, res: Response)=>{
    const fileUrl= String(req.query.file_url);
    // được sử dụng để lấy tên file từ URL
    const fileName = path.basename(fileUrl);
    
    try {
        // Khi bạn gọi axios.get() với responseType: 'stream', axios bắt đầu tải file từ URL và tạo một stream chứa nội dung của file đó.
        const response = await axios.get(fileUrl, { responseType: 'stream' });
    
        // Đặt header để tải file về
        // Content-Disposition: Header này cho trình duyệt biết rằng file này sẽ được tải về thay vì 
        // hiển thị trong cửa sổ trình duyệt. attachment có nghĩa là trình duyệt sẽ hiển thị hộp thoại tải xuống
        // , và filename=${fileName} chỉ định tên file khi người dùng lưu file xuống máy.
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        // Content-Type: Đây là header HTTP để chỉ định kiểu nội dung của file. Trong trường hợp này,
        //  chúng ta sử dụng audio/mpeg để chỉ định rằng file này là một file MP3.
        res.setHeader('Content-Type', 'audio/mpeg');
    
        // Gửi stream của file tới trình duyệt để tải

// Sau khi nhận được dữ liệu từ axios, phương thức pipe() sẽ tự động chuyển dữ liệu từ stream response.data vào res. Express sẽ gửi dòng dữ liệu này tới trình duyệt của người dùng. Dữ liệu sẽ được "đẩy" tới trình duyệt theo từng phần nhỏ (dưới dạng stream), thay vì tải toàn bộ file vào bộ nhớ trước.
// Trình duyệt nhận và lưu file: Trình duyệt của người dùng sẽ nhận dữ liệu từ stream này và bắt đầu lưu file vào máy tính của họ theo tên file mà bạn đã chỉ định trong header Content-Disposition.        
        response.data.pipe(res);

    } catch (error) {
        res.redirect('back');
    }
}   

export const upload=async (req: Request, res: Response)=>{
    const topics=await Topic.find({
        deleted:false
    }).select('title')
    const singers=await Singer.find({
        deleted:false 
    }).select('fullName')
    res.render('client/pages/songs/upload',
        {
            title:'Upload bài hát',
            topics:topics,
            singers:singers
        }
    )
}
export const createPost=async (req: Request, res: Response)=>{
    let avatar='';
    let audio='';
    if(req.body.avatar){
        avatar=req.body.avatar[0]
    }
    if(req.body.audio){
        audio=req.body.audio[0]
    }
    const countSong=await Song.countDocuments();
    req.body.position=countSong+1
    const dataSong={
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        status: 'inactive',
        lyrics:req.body.lyrics,
        position: req.body.position,
        avatar: avatar,
        audio: audio
    }
    const createdBy={
        user_id:res.locals.user.id,
    }
    dataSong['createdBy']=createdBy
    const song=new Song(dataSong)
    await song.save();
    req.flash('success', `Đã thêm thành công bài hát`);
    res.redirect(`/songs/upload`);
}