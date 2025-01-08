"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_playlist_model_1 = __importDefault(require("../../models/favorite-playlist.model"));
const playlist_model_1 = __importDefault(require("../../models/playlist.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user.id;
    const favoritePlaylists = yield favorite_playlist_model_1.default.find({
        userId: userId
    });
    for (const playlist of favoritePlaylists) {
        const infoPlaylist = yield playlist_model_1.default.findOne({
            _id: playlist.playlistId,
            status: 'active',
            deleted: false,
        });
        playlist['infoPlaylist'] = infoPlaylist;
        const topic = yield topic_model_1.default.findOne({
            _id: infoPlaylist.topicId,
        });
        const songs = yield song_model_1.default.aggregate([
            {
                $match: {
                    topicId: topic.id
                }
            },
            {
                $sort: { listen: -1 }
            },
            {
                $group: {
                    _id: "$singerId"
                }
            },
            {
                $limit: 6
            }
        ]);
        const singerIds = songs.map(song => song._id);
        const singers = yield singer_model_1.default.find({ _id: { $in: singerIds } }).select('fullName');
        const nameSinger = singers.map((item) => {
            return item.fullName;
        }).join(', ');
        playlist['nameSinger'] = nameSinger;
    }
    res.render('client/pages/favorite-playlists/index', {
        title: 'Bài hát yêu thích',
        favoritePlaylists: favoritePlaylists
    });
});
exports.index = index;
