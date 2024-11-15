import mongoose from 'mongoose';
import slug from "mongoose-slug-updater"
mongoose.plugin(slug)
const topicSchema=new mongoose.Schema({
    title:String,
    avatar:String,
    description:String,
    position:Number,
    status:String,
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
        createdAt:{
            type:Date,
            default:Date.now,
        }
    },
    deleteBy:{
        account_id:String,
        deletedAt:Date
    },
    updatedBy:[
        {
            account_id:String,
            updatedAt:Date
        }
    ]
},
{
   timestamps:true
})
const Topic=mongoose.model('Topic',topicSchema,'topics')
export default Topic