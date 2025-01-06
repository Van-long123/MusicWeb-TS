import mongoose from "mongoose";
import slug from 'mongoose-slug-updater'
mongoose.plugin(slug)
const palylistSchema=new mongoose.Schema({
    title:String,
    avatar:String,
    description:String,
    status:String,
    position:Number,
    topicId:String,
    slug:{
        type :String,
        slug:'title',
        unique:true
    },
    deleted:{
        type:Boolean,
        default:false
    },
    createdBy:{
        account_id:String,
        user_id:String,
        createdAt:{
            type:Date,
            default:Date.now,
        }
    },
    deletedBy:{
        account_id:String,
        deletedAt:Date
    },
    updatedBy:[
        {
            account_id:String,
            updatedAt:Date
        }
    ]
})
const Playlist=mongoose.model('Playlist',palylistSchema,'playlists')
export default Playlist