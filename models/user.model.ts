import mongoose, { mongo } from "mongoose";
import * as generate from '../helpers/generate'
const userSchema=new mongoose.Schema({
    _id: { type: String,default: () => new mongoose.Types.ObjectId().toHexString(), },
    fullName:String,
    email:String,
    password:String,
    address:String,
    gender:String,
    province:String,
    tokenUser:{
        type:String,
        default:generate.generateRandomString(30)
    },
    typeLogin:{
        type:String,
        default:'normal'
    },
    phone:String,
    avatar:String,
    status:{
        type:String,
        default:'active'
    },
    deleted:{
        type:Boolean,
        default:false
    },
    deleteAt:Date,
},
{
    timestamps:true
})
const User=mongoose.model('User',userSchema,'users')
export default User;