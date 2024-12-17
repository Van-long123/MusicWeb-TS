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
exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.changeMulti = exports.deleteItem = exports.changeStatus = exports.index = void 0;
const fillterStatusHelper_1 = __importDefault(require("../../helpers/fillterStatusHelper"));
const search_1 = __importDefault(require("../../helpers/search"));
const paginationHelper_1 = __importDefault(require("../../helpers/paginationHelper"));
const systemConfig = __importStar(require("../../config/system"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
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
    const objectSeach = (0, search_1.default)(req.query);
    const keyword = objectSeach.keyword;
    if (req.query.keyword) {
        find['$or'] = [
            {
                title: objectSeach['keywordRegex']
            },
            {
                slug: objectSeach['slugRegex']
            }
        ];
    }
    const countTopics = yield topic_model_1.default.countDocuments(find);
    const objectPagination = (0, paginationHelper_1.default)(req.query, countTopics, {
        currentPage: 1,
        limitItems: 8
    });
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey.toLocaleString();
        sort[sortKey] = req.query.sortValue;
    }
    else {
        sort['position'] = "desc";
    }
    const topics = yield topic_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    for (const topic of topics) {
        const user = yield account_model_1.default.findOne({
            _id: topic.createdBy.account_id
        });
        if (user) {
            topic['fullName'] = user.fullname;
        }
        const updateBy = topic.updatedBy[topic.updatedBy.length - 1];
        if (updateBy) {
            const user = yield account_model_1.default.findOne({
                _id: updateBy.account_id
            });
            if (user) {
                updateBy['accountFullName'] = user.fullname;
            }
        }
    }
    res.render('admin/pages/topics/index', {
        title: "Quản lý chủ đề",
        topics: topics,
        fillterStatus: fillterStatus,
        keyword: keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("topics_edit")) {
        return;
    }
    const status = req.params.status;
    const id = req.params.id;
    yield topic_model_1.default.updateOne({
        _id: id
    }, {
        status: status
    });
    req.flash('success', 'Cập nhật trạng thái chủ đề thành công');
    res.redirect('back');
});
exports.changeStatus = changeStatus;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("topics_delete")) {
        return;
    }
    const id = req.params.id;
    const deletedBy = {
        account_id: res.locals.user.id,
        deletedAt: new Date()
    };
    yield topic_model_1.default.updateOne({
        _id: id
    }, {
        deleted: true, deletedBy: deletedBy
    });
    req.flash('success', 'Đã xóa chủ đề thành công');
    res.redirect('back');
});
exports.deleteItem = deleteItem;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("topics_edit")) {
        return;
    }
    const type = req.body.type;
    let ids = req.body.ids.split(',').map((id) => id.trim());
    switch (type) {
        case 'active':
            yield topic_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                status: 'active'
            });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} chủ đề`);
            break;
        case 'inactive':
            yield topic_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                status: 'inactive'
            });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} chủ đề`);
            break;
        case 'delete-all':
            yield topic_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                deleted: true
            });
            req.flash('success', `Xóa thành công ${ids.length} chủ đề`);
            break;
        case 'change-position':
            for (const item of ids) {
                let value = item.split('-');
                const id = value[0];
                const position = value[1];
                yield topic_model_1.default.updateOne({
                    _id: id
                }, {
                    position: position
                });
            }
            req.flash('success', `Đổi vị trí thành công ${ids.length} chủ đề`);
            break;
    }
    res.redirect('back');
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('admin/pages/topics/create', {
        title: "Thêm chủ đề mới",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("topics_create")) {
        return;
    }
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    }
    else {
        const topicCount = yield topic_model_1.default.countDocuments();
        req.body.position = topicCount + 1;
    }
    const createdBy = {
        account_id: res.locals.user.id,
    };
    req.body.createdBy = createdBy;
    const topic = new topic_model_1.default(req.body);
    topic.save();
    req.flash('success', `Đã thêm thành công chủ đề`);
    res.redirect(`${systemConfig.prefixAdmin}/topics`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield topic_model_1.default.findOne({
            _id: req.params.id
        });
        res.render('admin/pages/topics/edit', {
            title: "Cập nhật chủ đề",
            topic: topic
        });
    }
    catch (error) {
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("topics_edit")) {
        return;
    }
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    }
    else {
        const topicCount = yield topic_model_1.default.countDocuments();
        req.body.position = topicCount + 1;
    }
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    yield topic_model_1.default.updateOne({ _id: req.params.id }, Object.assign(Object.assign({}, req.body), { $push: { updatedBy: updatedBy } }));
    req.flash('success', `Cập nhật thành công chủ đề`);
    res.redirect(`back`);
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield topic_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render('admin/pages/topics/detail', {
            title: "Cập nhật hát mới",
            topic: topic,
        });
    }
    catch (error) {
    }
});
exports.detail = detail;
