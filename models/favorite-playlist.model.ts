import mongoose from "mongoose";
const favoritePlaylistSchema=new mongoose.Schema({
    userId:String,
    playlistId:String,
    // deleted:{
    //     type:Boolean,
    //     default:false
    // },
},
{
    timestamps:true
})
const FavoritePlaylist=mongoose.model('FavoritePlaylist',favoritePlaylistSchema,'favorite-playlist')
export default FavoritePlaylist