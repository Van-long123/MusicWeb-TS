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
exports.editPatch = exports.edit = exports.createPost = exports.create = exports.detail = exports.changeMulti = exports.deleteItem = exports.changeStatus = exports.index = void 0;
const playlist_model_1 = __importDefault(require("../../models/playlist.model"));
const fillterStatusHelper_1 = __importDefault(require("../../helpers/fillterStatusHelper"));
const search_1 = __importDefault(require("../../helpers/search"));
const paginationHelper_1 = __importDefault(require("../../helpers/paginationHelper"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const systemConfig = __importStar(require("../../config/system"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("playlists_view")) {
        return;
    }
    let find = {
        deleted: false
    };
    let sort = {};
    let fillterStatus = (0, fillterStatusHelper_1.default)(req.query);
    if (req.query.status) {
        find['status'] = req.query.status;
    }
    const objectSearch = (0, search_1.default)(req.query);
    if (req.query.keyword) {
        find['$or'] = [
            { title: objectSearch['keywordRegex'] },
            { slug: objectSearch['slugRegex'] }
        ];
    }
    const countPlaylist = yield playlist_model_1.default.countDocuments(find);
    const objectPagination = (0, paginationHelper_1.default)(req.query, countPlaylist, {
        currentPage: 1,
        limitItems: 8
    });
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toString();
        sort[sortKey] = req.query.sortValue;
    }
    const playlists = yield playlist_model_1.default.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip)
        .sort(sort);
    for (const playlist of playlists) {
        const user = yield account_model_1.default.findOne({
            _id: playlist.createdBy.account_id
        });
        if (user) {
            playlist['fullName'] = user.fullname;
        }
        const updateBy = playlist.updatedBy[playlist.updatedBy.length - 1];
        if (updateBy) {
            const user = yield account_model_1.default.findOne({
                _id: updateBy.account_id
            });
            if (user) {
                updateBy['accountFullName'] = user.fullname;
            }
        }
    }
    res.render('admin/pages/playlists/index', {
        title: "Quản lý danh sách phát",
        playlists: playlists,
        fillterStatus: fillterStatus,
        pagination: objectPagination,
        keyword: objectSearch.keyword
    });
});
exports.index = index;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("playlists_edit")) {
        return;
    }
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    yield playlist_model_1.default.updateOne({
        _id: id,
    }, {
        status: status, $push: { updatedBy: updatedBy }
    });
    req.flash('success', 'Cập nhật trạng thái danh sách phát thành công');
    res.redirect('back');
});
exports.changeStatus = changeStatus;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("playlists_delete")) {
        return;
    }
    const id = req.params.id;
    const deletedBy = {
        account_id: res.locals.user.id,
        deletedAt: new Date()
    };
    yield playlist_model_1.default.updateOne({
        _id: id,
    }, {
        deleted: true,
        deletedBy: deletedBy
    });
    req.flash('success', 'Đã xóa danh sách phát thành công');
    res.redirect('back');
});
exports.deleteItem = deleteItem;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("playlists_edit")) {
        return;
    }
    const type = req.body.type;
    let ids = req.body.ids.split(',').map((id) => id.trim());
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    switch (type) {
        case 'active':
            yield playlist_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                status: 'active', $push: { updatedBy: updatedBy }
            });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} danh sách phát`);
            break;
        case 'inactive':
            yield playlist_model_1.default.updateMany({ _id: { $in: ids } }, { status: 'inactive', $push: { updatedBy: updatedBy } });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} danh sách phát`);
            break;
        case 'delete-all':
            const deletedBy = {
                account_id: res.locals.user.id,
                deletedAt: new Date()
            };
            yield playlist_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                deleted: true, deletedBy: deletedBy
            });
            req.flash('success', `Xóa thành công ${ids.length} danh sách phát`);
            break;
        case 'change-position':
            for (const item of ids) {
                let value = item.split('-');
                const id = value[0];
                const position = parseInt(value[1]);
                yield playlist_model_1.default.updateOne({
                    _id: id
                }, {
                    position: position, $push: { updatedBy: updatedBy }
                });
            }
            req.flash('success', `Đổi vị trí thành công ${ids.length} danh sách phát`);
            break;
    }
    res.redirect('back');
});
exports.changeMulti = changeMulti;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("playlists_view")) {
        return;
    }
    try {
        const id = req.params.id;
        const playlist = yield playlist_model_1.default.findOne({
            _id: id
        });
        const topic = yield topic_model_1.default.findOne({
            _id: playlist.topicId,
            deleted: false
        }).select('title');
        res.render('admin/pages/playlists/detail', {
            title: "Chi tiết danh sách phát",
            topic: topic,
            playlist: playlist
        });
    }
    catch (error) {
        res.redirect('/');
    }
});
exports.detail = detail;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        deleted: false
    }).select('title');
    res.render('admin/pages/playlists/create', {
        title: "Thêm danh sách phát mới",
        topics: topics,
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("playlists_create")) {
        return;
    }
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    }
    else {
        const playlistCount = yield playlist_model_1.default.countDocuments();
        req.body.position = playlistCount + 1;
    }
    const createdBy = {
        account_id: res.locals.user.id,
    };
    req.body.createdBy = createdBy;
    const playlist = new playlist_model_1.default(req.body);
    playlist.save();
    req.flash('success', `Đã thêm thành công danh sách phát`);
    res.redirect(`${systemConfig.prefixAdmin}/playlists`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const playlist = yield playlist_model_1.default.findOne({
            _id: id
        });
        const topics = yield topic_model_1.default.find({
            deleted: false
        }).select('title');
        res.render('admin/pages/playlists/edit', {
            title: "Cập nhật danh sách phát",
            topics: topics,
            playlist: playlist
        });
    }
    catch (error) {
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("playlists_edit")) {
        return;
    }
    try {
        const id = req.params.id;
        if (req.body.position) {
            req.body.position = parseInt(req.body.position);
        }
        else {
            const countPlaylist = yield playlist_model_1.default.countDocuments();
            req.body.position = countPlaylist + 1;
        }
        const dataSong = {
            title: req.body.title,
            topicId: req.body.topicId,
            description: req.body.description,
            status: req.body.status,
            position: req.body.position,
            avatar: req.body.avatar
        };
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        yield playlist_model_1.default.updateOne({
            _id: id
        }, Object.assign(Object.assign({}, dataSong), { $push: { updatedBy: updatedBy } }));
        req.flash('success', `Cập nhật thành công danh sách phát`);
        res.redirect(`back`);
    }
    catch (error) {
    }
});
exports.editPatch = editPatch;
