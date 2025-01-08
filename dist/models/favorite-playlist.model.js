"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const favoritePlaylistSchema = new mongoose_1.default.Schema({
    userId: String,
    playlistId: String,
}, {
    timestamps: true
});
const FavoritePlaylist = mongoose_1.default.model('FavoritePlaylist', favoritePlaylistSchema, 'favorite-playlist');
exports.default = FavoritePlaylist;
