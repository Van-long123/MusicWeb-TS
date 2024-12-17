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
    const songsLike = yield song_model_1.default.find({
        status: 'active',
        deleted: false,
    }).limit(4).sort({ like: 'desc' }).select('avatar title slug singerId like');
    for (const item of songsLike) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: item.singerId,
            status: 'active',
            deleted: false
        }).select('fullName');
        item['likeCount'] = item.like.length;
        item['infoSinger'] = infoSinger;
    }
    const songsListen = yield song_model_1.default.find({
        status: 'active',
        deleted: false,
    }).limit(4).sort({ listen: 'desc' }).select('avatar title slug singerId like');
    for (const item of songsListen) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: item.singerId,
            status: 'active',
            deleted: false
        }).select('fullName');
        item['likeCount'] = item.like.length;
        item['infoSinger'] = infoSinger;
    }
    res.render('client/pages/home/index', {
        title: "Trang chủ",
        topics: topics,
        songsLike: songsLike,
        songsListen: songsListen,
        songsRandom: songsRandom
    });
});
exports.index = index;
