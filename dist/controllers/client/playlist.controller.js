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
exports.favorite = exports.detail = exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const playlist_model_1 = __importDefault(require("../../models/playlist.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const paginationHelper_1 = __importDefault(require("../../helpers/paginationHelper"));
const favorite_playlist_model_1 = __importDefault(require("../../models/favorite-playlist.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        status: 'active',
        deleted: false,
    };
    const countPlaylist = yield playlist_model_1.default.countDocuments(find);
    const objectPagination = (0, paginationHelper_1.default)(req.query, countPlaylist, {
        currentPage: 1,
        limitItems: 12,
    });
    const playlists = yield playlist_model_1.default.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
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
    res.render('client/pages/playlists/index', {
        title: "Top 100 | Tuyển tập nhạc hay chọn lọc",
        playlists: playlists,
        pagination: objectPagination
    });
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slug;
        const playlist = yield playlist_model_1.default.findOne({
            slug: slug,
        }).select('topicId');
        if (!playlist) {
            res.redirect('/');
            return;
        }
        const songs = yield song_model_1.default.find({
            deleted: false,
            status: "active",
            topicId: playlist.topicId
        }).sort({
            listen: 'desc'
        }).limit(100).select('title avatar description audio rawLyrics lyrics singerId');
        let singers = [];
        for (const song of songs) {
            const singer = yield singer_model_1.default.findOne({
                _id: song.singerId,
                status: 'active',
                deleted: false
            }).select('fullName');
            singers.push(singer.fullName);
        }
        res.render('client/pages/playlists/detail', {
            songs: songs,
            singers: singers
        });
    }
    catch (error) {
        res.redirect('/');
    }
});
exports.detail = detail;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idPlaylist = req.params.idPlaylist;
        const typeFavorite = req.params.typeFavorite;
        const userId = res.locals.user.id;
        console.log(idPlaylist);
        console.log(typeFavorite);
        switch (typeFavorite) {
            case 'favorite':
                const playlistFavorite = yield favorite_playlist_model_1.default.findOne({
                    playlistId: idPlaylist,
                    userId: userId,
                });
                if (!playlistFavorite) {
                    const record = new favorite_playlist_model_1.default({
                        playlistId: idPlaylist,
                        userId: userId,
                    });
                    yield record.save();
                }
                break;
            case 'unFavorite':
                const isSongFavorite = yield favorite_playlist_model_1.default.findOne({
                    playlistId: idPlaylist,
                    userId: userId,
                });
                if (isSongFavorite) {
                    yield favorite_playlist_model_1.default.deleteOne({
                        playlistId: idPlaylist,
                        userId: userId,
                    });
                }
                break;
            default:
                res.json({
                    code: 400,
                    message: 'Lỗi !'
                });
                break;
        }
        res.json({
            code: 200,
            message: "Thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        });
    }
});
exports.favorite = favorite;
