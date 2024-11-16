import mongoose from "mongoose";
import * as generate from '../helpers/generate'
const accountSchema=new mongoose.Schema({
    fullname:String,
    email:String,
    password:String,
    token:{
        type:String,
        default:generate.generateRandomString(30)
    },
    phone:String,
    avatar:String,
    role_id:String,
    status:String,
    deleted:{
        type:Boolean,
        default:false
    },
    deleteAt:Date,
},{
    timestamps:true
})
const Account=mongoose.model('Account',accountSchema,'accounts')
export default Account