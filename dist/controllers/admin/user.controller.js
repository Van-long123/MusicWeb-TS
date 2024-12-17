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
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
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
                fullName: objectSeach['keywordRegex']
            }
        ];
    }
    const countTopics = yield singer_model_1.default.countDocuments(find);
    const objectPagination = (0, paginationHelper_1.default)(req.query, countTopics, {
        currentPage: 1,
        limitItems: 8
    });
    const records = yield user_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render('admin/pages/users/index', {
        title: "Danh sách tài khoản",
        records: records,
        fillterStatus: fillterStatus,
        keyword: keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("users_edit")) {
        return;
    }
    const status = req.params.status;
    const id = req.params.id;
    yield user_model_1.default.updateOne({
        _id: id
    }, {
        status: status
    });
    req.flash('success', 'Cập nhật trạng thái tài khoản thành công');
    res.redirect('back');
});
exports.changeStatus = changeStatus;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("users_delete")) {
        return;
    }
    const id = req.params.id;
    yield user_model_1.default.updateOne({
        _id: id
    }, {
        deleted: true
    });
    req.flash('success', 'Đã xóa tài khoản thành công');
    res.redirect('back');
});
exports.deleteItem = deleteItem;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("users_edit")) {
        return;
    }
    const type = req.body.type;
    let ids = req.body.ids.split(',').map((id) => id.trim());
    switch (type) {
        case 'active':
            yield user_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                status: 'active'
            });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} tài khoản`);
            break;
        case 'inactive':
            yield user_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                status: 'inactive'
            });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} tài khoản`);
            break;
        case 'delete-all':
            yield user_model_1.default.updateMany({
                _id: { $in: ids }
            }, {
                deleted: true
            });
            req.flash('success', `Xóa thành công ${ids.length} tài khoản`);
            break;
    }
    res.redirect('back');
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('admin/pages/users/create', {
        title: "Thêm tài khoản mới",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("users_create")) {
        return;
    }
    const existEmail = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existEmail) {
        req.flash('error', `Email đã tồn tại`);
        res.redirect(`back`);
        return;
    }
    req.body.password = (0, md5_1.default)(req.body.password);
    const user = new user_model_1.default(req.body);
    user.save();
    req.flash('success', `Đã thêm thành công tài khoản`);
    res.redirect(`${systemConfig.prefixAdmin}/users`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield user_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render('admin/pages/users/edit', {
            title: "Cập nhật tài khoản",
            data: data
        });
    }
    catch (error) {
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("users_edit")) {
        return;
    }
    const emailExist = yield user_model_1.default.findOne({
        _id: { $ne: req.params.id },
        email: req.body.email,
        deleted: false
    });
    if (emailExist) {
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
        res.redirect(`back`);
        return;
    }
    else {
        if (req.body.password) {
            req.body.password = (0, md5_1.default)(req.body.password);
        }
        else {
            delete req.body.password;
        }
        yield user_model_1.default.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash('success', `Cập nhật thành công tài khoản`);
        res.redirect('back');
    }
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render('admin/pages/users/detail', {
            title: user.fullName,
            user: user,
        });
    }
    catch (error) {
    }
});
exports.detail = detail;
