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
exports.download = exports.favorite = exports.like = exports.listen = exports.detail = exports.random = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const paginationHelper_1 = __importDefault(require("../../helpers/paginationHelper"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const listen_history_model_1 = __importDefault(require("../../models/listen-history.model"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.slug;
        let find = {
            status: 'active',
            deleted: false,
        };
        let sort = {};
        let title = "";
        if (type == 'like') {
            sort['like'] = 'desc';
            title = "Top 20 bài hát có nhiều like nhất";
        }
        else if (type == 'listen') {
            sort['listen'] = 'desc';
            title = "Top 20 bài hát có nhiều lượt nghe nhất";
        }
        else {
            const topic = yield topic_model_1.default.findOne({
                slug: req.params.slug,
                status: 'active',
                deleted: false,
            });
            if (!topic) {
                res.redirect('back');
                return;
            }
            find['topicId'] = topic.id;
            title = topic.title;
        }
        const songsLimited = yield song_model_1.default.find(find)
            .sort(sort)
            .limit(20)
            .select('avatar title slug singerId like');
        const countSongs = songsLimited.length;
        const objectPagination = (0, paginationHelper_1.default)(req.query, countSongs, {
            currentPage: 1,
            limitItems: 16,
        });
        const songs = songsLimited.slice(objectPagination.skip, objectPagination.skip + objectPagination.limitItems);
        for (const item of songs) {
            const infoSinger = yield singer_model_1.default.findOne({
                _id: item.singerId,
                status: 'active',
                deleted: false
            }).select('fullName');
            item['likeCount'] = item.like.length;
            item['infoSinger'] = infoSinger;
        }
        res.render('client/pages/songs/index', {
            title: title,
            songs: songs,
            pagination: objectPagination
        });
    }
    catch (error) {
        res.redirect('/');
    }
});
exports.index = index;
const random = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    res.json({
        code: 200,
        message: 'Thành công',
        songsRandom: songsRandom
    });
});
exports.random = random;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slugSong = req.params.slugSong;
        const song = yield song_model_1.default.findOne({
            slug: slugSong,
            deleted: false,
            status: "active"
        });
        song['likeCount'] = song.like.length;
        const singer = yield singer_model_1.default.findOne({
            _id: song.singerId,
            status: 'active',
            deleted: false
        }).select('fullName');
        const topic = yield topic_model_1.default.findOne({
            _id: song.topicId,
            status: 'active',
            deleted: false
        }).select('title');
        if (res.locals.user) {
            const isFavoriteSong = yield favorite_song_model_1.default.findOne({
                userId: res.locals.user.id,
                songId: song.id
            });
            song['isFavoriteSong'] = isFavoriteSong ? true : false;
            song['isLikeSong'] = song['like'].some(item => {
                return item == res.locals.user.id;
            });
        }
        if (res.locals.user) {
            const existHistory = yield listen_history_model_1.default.findOne({
                userId: res.locals.user.id,
                songId: song.id,
            });
            if (!existHistory) {
                const listenHistory = new listen_history_model_1.default({
                    userId: res.locals.user.id,
                    songId: song.id,
                });
                yield listenHistory.save();
            }
        }
        res.render('client/pages/songs/detail', {
            title: slugSong,
            song: song,
            singer: singer,
            topic: topic,
        });
    }
    catch (error) {
        res.redirect('/');
    }
});
exports.detail = detail;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        const song = yield song_model_1.default.findOne({
            _id: idSong,
            deleted: false,
            status: "active"
        });
        const listen = song.listen + 1;
        yield song_model_1.default.updateOne({
            _id: idSong,
            deleted: false,
            status: "active"
        }, {
            listen: listen
        });
        res.json({
            code: 200,
            message: 'Thành công',
            listen: listen
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: 'Lỗi!',
        });
    }
});
exports.listen = listen;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const typeLike = req.params.typeLike;
        const idSong = req.params.idSong;
        const song = yield song_model_1.default.findOne({
            _id: idSong,
            deleted: false,
            status: "active"
        });
        if (!song) {
            res.json({
                code: 400,
                message: "Lỗi!"
            });
        }
        const newLike = typeLike == "like" ? song['like'].length + 1 : song['like'].length - 1;
        if (typeLike == "like") {
            yield song_model_1.default.updateOne({
                _id: idSong,
                deleted: false,
                status: "active"
            }, {
                $push: { like: res.locals.user.id }
            });
        }
        else {
            yield song_model_1.default.updateOne({
                _id: idSong,
                deleted: false,
                status: "active"
            }, {
                $pull: { like: res.locals.user.id }
            });
        }
        res.json({
            code: 200,
            message: "Thành công!",
            like: newLike
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        });
    }
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        const typeFavorite = req.params.typeFavorite;
        const userId = res.locals.user.id;
        switch (typeFavorite) {
            case 'favorite':
                const songFavorite = yield favorite_song_model_1.default.findOne({
                    songId: idSong,
                    userId: userId,
                });
                if (!songFavorite) {
                    const record = new favorite_song_model_1.default({
                        songId: idSong,
                        userId: userId,
                    });
                    yield record.save();
                }
                break;
            case 'unFavorite':
                const isSongFavorite = yield favorite_song_model_1.default.findOne({
                    songId: idSong,
                    userId: userId,
                });
                if (isSongFavorite) {
                    yield favorite_song_model_1.default.deleteOne({
                        songId: idSong,
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
const download = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileUrl = String(req.query.file_url);
    const fileName = path_1.default.basename(fileUrl);
    try {
        const response = yield axios_1.default.get(fileUrl, { responseType: 'stream' });
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'audio/mpeg');
        response.data.pipe(res);
    }
    catch (error) {
        res.redirect('back');
    }
});
exports.download = download;
