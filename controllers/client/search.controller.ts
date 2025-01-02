import {Request,Response} from 'express';
import {convertToSlug} from '../../helpers/convertToSlug'
import Song from '../../models/song.model';
import Singer from '../../models/singer.model';
export const result=async  (req:Request, res:Response) => {
    try {
        const type=req.params.type;
        const keyword:string=`${req.query.keyword}`;
        let newSongs=[];
        let singers;
        if(keyword){
            const keywordRegex=new RegExp(keyword,'i');
            const stringSlug=convertToSlug(keyword)
            const slugRegex=new RegExp(stringSlug,'i');
            singers=await Singer.find({
                $or:[
                    {fullName:keywordRegex},
                    {slug:slugRegex}
                ],
                deleted:false
            })
            const songs=await Song.find({
                $or:[
                    {title:keywordRegex},
                    {slug:slugRegex}
                ],
                deleted:false
            })
            for (const song of songs) {
                const infoSinger=await Singer.findOne({
                    _id: song.singerId,
                    status:'active',
                    deleted:false
                })
                newSongs.push({
                    id:song.id,
                    title:song.title,
                    avatar:song.avatar,
                    like:song.like,
                    slug:song.slug,
                    infoSinger:{
                        fullName:infoSinger.fullName
                    }
                })
            }
        }
        else{
            if(type=='suggest'){
                res.json({
                    code:200,
                    message:"Thành công",
                    songs:newSongs,
                    singers:[],
                })
                return ;
            }
            res.redirect('back');
            return;
        }
        switch (type) {
            case "result":
                res.render('client/pages/search/result',{
                    title:`Kết quả ${keyword}`,
                    keyword:keyword,
                    songs:newSongs
                })
                break;
            case "suggest":
                res.json({
                    code:200,
                    message:"Thành công",
                    songs:newSongs,
                    singers:singers
                })
                break;
            default:
                break;
        }
    } catch (error) {
        
    }
}