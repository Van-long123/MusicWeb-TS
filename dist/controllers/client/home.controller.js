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
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const playlist_model_1 = __importDefault(require("../../models/playlist.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        status: 'active',
        deleted: false,
    }).limit(6);
    const songsRandom = yield song_model_1.default.aggregate([
        { $match: { status: 'active', deleted: false } },
        { $sample: { size: 9 } }
    ]);
    for (const item of songsRandom) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: item.singerId,
            status: 'active',
            deleted: false
        }).select('fullName');
        item['infoSinger'] = infoSinger;
    }
    const songs = yield song_model_1.default.find({
        status: 'active',
        deleted: false,
    }).limit(4).select('avatar title slug singerId like');
    for (const item of songs) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: item.singerId,
            status: 'active',
            deleted: false
        }).select('fullName');
        item['likeCount'] = item.like.length;
        item['infoSinger'] = infoSinger;
    }
    const playlists = yield playlist_model_1.default.find({
        status: 'active',
        deleted: false,
    });
    for (const item of playlists) {
        const topic = yield topic_model_1.default.findOne({
            _id: item.topicId,
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
        item['nameSinger'] = nameSinger;
    }
    res.render('client/pages/home/index', {
        title: "Trang chủ",
        topics: topics,
        playlists: playlists,
        songs: songs,
        songsRandom: songsRandom
    });
});
exports.index = index;
