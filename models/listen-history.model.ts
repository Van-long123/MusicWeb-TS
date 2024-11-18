import mongoose from "mongoose";
const listenHistorySchema=new mongoose.Schema({
    userId: String,     
    songId: String,       
    listenedAt: {
        type:Date,
        default:Date.now
    }, 
},
{
    timestamps:true,
})

const ListenHistory=mongoose.model('ListenHistory',listenHistorySchema,'listen-history')
export default ListenHistory