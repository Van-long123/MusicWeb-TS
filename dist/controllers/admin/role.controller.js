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
exports.permissionsPatch = exports.permissions = exports.deleteItem = exports.editPost = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../models/role.model"));
const systemConfig = __importStar(require("../../config/system"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield role_model_1.default.find({
        deleted: false
    });
    res.render('admin/pages/roles/index', {
        title: 'Nhóm quyền',
        records: records
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("products_edit")) {
        return;
    }
    res.render('admin/pages/roles/create', {
        title: 'Tạo nhóm quyền'
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("roles_create")) {
        return;
    }
    const record = new role_model_1.default(req.body);
    yield record.save();
    req.flash('success', `Thêm thành công nhóm quyền`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield role_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render('admin/pages/roles/edit', {
            title: 'Cập nhật nhóm quyền',
            record: record
        });
    }
    catch (error) {
        req.flash('error', 'Nhóm ko tồn tại');
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
});
exports.edit = edit;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("roles_edit")) {
        return;
    }
    yield role_model_1.default.updateOne({
        _id: req.params.id,
        deleted: false
    }, req.body);
    req.flash('success', `Cập nhật nhóm quyền thành công`);
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
});
exports.editPost = editPost;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("roles_delete")) {
        return;
    }
    const id = req.params.id;
    yield role_model_1.default.updateOne({
        _id: id,
    }, {
        deleted: true
    });
    req.flash('success', 'Đã xóa sản phẩm thành công');
    res.redirect('back');
});
exports.deleteItem = deleteItem;
const permissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield role_model_1.default.find({
        deleted: false
    });
    res.render('admin/pages/roles/permission', {
        title: "Phân quyền",
        records
    });
});
exports.permissions = permissions;
const permissionsPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions1 = res.locals.role.permissions;
    if (!permissions1.includes("roles_permissions")) {
        return;
    }
    const permissions = JSON.parse(req.body.permissions);
    for (const permission of permissions) {
        yield role_model_1.default.updateOne({
            _id: permission.id
        }, {
            permissions: permission.permissions
        });
    }
    req.flash("success", "Cập nhật phân quyền thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
});
exports.permissionsPatch = permissionsPatch;
