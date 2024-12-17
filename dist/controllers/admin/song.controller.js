"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.detail = exports.editPost = exports.edit = exports.createPost = exports.create = exports.changeMulti = exports.deleteItem = exports.changeStatus = exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const fillterStatusHelper_1 = __importDefault(require("../../helpers/fillterStatusHelper"));
const search_1 = __importDefault(require("../../helpers/search"));
const paginationHelper_1 = __importDefault(require("../../helpers/paginationHelper"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const systemConfig = __importStar(require("../../config/system"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    let sort = {};
    let fillterStatus = (0, fillterStatusHelper_1.default)(req.query);
    if (req.query.status) {
        find['status'] = req.query.status;
    }
    const objectSearch = (0, search_1.default)(req.query);
    let keyword = objectSearch.keyword;
    if (req.query.keyword) {
        find['$or'] = [
            { title: objectSearch['keywordRegex'] },
            { slug: objectSearch['slugRegex'] }
        ];
    }
    const countSongs = yield song_model_1.default.countDocuments(find);
    const objectPagination = (0, paginationHelper_1.default)(req.query, countSongs, {
        currentPage: 1,
        limitItems: 8
    });
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    else {
        sort['position'] = 'desc';
    }
    const songs = yield song_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    for (const song of songs) {
        const user = yield account_model_1.default.findOne({
            _id: song.createdBy.account_id
        });
        if (user) {
            song['fullName'] = user.fullname;
        }
        const updateBy = song.updatedBy[song.updatedBy.length - 1];
        if (updateBy) {
            const user = yield account_model_1.default.findOne({
                _id: updateBy.account_id
            });
            if (user) {
                updateBy['accountFullName'] = user.fullname;
            }
        }
    }
    res.render('admin/pages/songs/index', {
        title: "Quản lý bài hát",
        songs: songs,
        fillterStatus: fillterStatus,
        keyword: keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("songs_edit")) {
        return;
    }
    const idSong = req.params.idSong;
    const status = req.params.status;
    yield song_model_1.default.updateOne({
        _id: idSong
    }, {
        status: status
    });
    req.flash('success', 'Cập nhật trạng thái bài hát thành công');
    res.redirect('back');
});
exports.changeStatus = changeStatus;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("songs_delete")) {
        return;
    }
    const id = req.params.idSong;
    const deletedBy = {
        account_id: res.locals.user.id,
        deletedAt: new Date()
    };
    yield song_model_1.default.updateOne({
        _id: id
    }, {
        deleted: true, deletedBy: deletedBy
    });
    req.flash('success', 'Đã xóa bài hát thành công');
    res.redirect('back');
});
exports.deleteItem = deleteItem;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("songs_edit")) {
        return;
    }
    const type = req.body.type;
    let ids = req.body.ids.split(',').map((id) => id.trim());
    switch (type) {
        case 'active':
            yield song_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                status: 'active'
            });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} bài hát`);
            break;
        case 'inactive':
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, { status: 'inactive' });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} bài hát`);
            break;
        case 'delete-all':
            yield song_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                deleted: true
            });
            req.flash('success', `Xóa thành công ${ids.length} bài hát`);
            break;
        case 'change-position':
            for (const item of ids) {
                let value = item.split('-');
                const id = value[0];
                const position = parseInt(value[1]);
                yield song_model_1.default.updateOne({
                    _id: id
                }, {
                    position: position
                });
            }
            req.flash('success', `Đổi vị trí thành công ${ids.length} bài hát`);
            break;
    }
    res.redirect('back');
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        deleted: false
    }).select('title');
    const singers = yield singer_model_1.default.find({
        deleted: false
    }).select('fullName');
    res.render('admin/pages/songs/create', {
        title: "Thêm bài hát mới",
        topics: topics,
        singers: singers
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("songs_create")) {
        return;
    }
    let avatar = '';
    let audio = '';
    if (req.body.avatar) {
        avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        audio = req.body.audio[0];
    }
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    }
    else {
        const countSong = yield song_model_1.default.countDocuments();
        req.body.position = countSong + 1;
    }
    const dataSong = {
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description,
        status: req.body.status,
        lyrics: req.body.lyrics,
        position: req.body.position,
        avatar: avatar,
        audio: audio
    };
    const createdBy = {
        account_id: res.locals.user.id,
    };
    dataSong['createdBy'] = createdBy;
    const song = new song_model_1.default(dataSong);
    yield song.save();
    req.flash('success', `Đã thêm thành công bài hát`);
    res.redirect(`${systemConfig.prefixAdmin}/songs`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const song = yield song_model_1.default.findOne({
            _id: id
        });
        const topics = yield topic_model_1.default.find({
            deleted: false
        }).select('title');
        const singers = yield singer_model_1.default.find({
            deleted: false
        }).select('fullName');
        res.render('admin/pages/songs/edit', {
            title: "Cập nhật bài hát mới",
            song: song,
            topics: topics,
            singers: singers
        });
    }
    catch (error) {
    }
});
exports.edit = edit;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("songs_edit")) {
        return;
    }
    try {
        const id = req.params.id;
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        }
        else {
            const countSong = yield song_model_1.default.countDocuments();
            req.body.position = countSong + 1;
        }
        const dataSong = {
            title: req.body.title,
            topicId: req.body.topicId,
            singerId: req.body.singerId,
            description: req.body.description,
            status: req.body.status,
            lyrics: req.body.lyrics,
            position: req.body.position,
        };
        if (req.body.avatar) {
            dataSong['avatar'] = req.body.avatar[0];
        }
        if (req.body.audio) {
            dataSong['audio'] = req.body.audio[0];
        }
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        yield song_model_1.default.updateOne({
            _id: id
        }, Object.assign(Object.assign({}, dataSong), { $push: { updatedBy: updatedBy } }));
        req.flash('success', `Cập nhật thành công bài hát`);
        res.redirect(`back`);
    }
    catch (error) {
    }
});
exports.editPost = editPost;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const song = yield song_model_1.default.findOne({
            _id: id
        });
        const topic = yield topic_model_1.default.findOne({
            _id: song.topicId,
            deleted: false
        }).select('title');
        const singer = yield singer_model_1.default.findOne({
            _id: song.singerId,
            deleted: false
        }).select('fullName');
        res.render('admin/pages/songs/detail', {
            title: "Chi tiết bài hát",
            song: song,
            topic: topic,
            singer: singer
        });
    }
    catch (error) {
    }
});
exports.detail = detail;
