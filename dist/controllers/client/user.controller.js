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
exports.editAccountPatch = exports.editAccount = exports.deleteMulti = exports.deleteItem = exports.listenHistory = exports.managePlaylist = exports.myAccount = exports.resetPost = exports.reset = exports.otpPasswordPost = exports.otpPassword = exports.forgotPasswordPost = exports.forgotPassword = exports.logout = exports.registerPost = exports.register = exports.loginPost = exports.login = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generateHelper = __importStar(require("../../helpers/generate"));
const forgor_password_model_1 = __importDefault(require("../../models/forgor-password.model"));
const sendMailHelper = __importStar(require("../../helpers/sendMail"));
const inspector_1 = require("inspector");
const listen_history_model_1 = __importDefault(require("../../models/listen-history.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const paginationHelper_1 = __importDefault(require("../../helpers/paginationHelper"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('client/pages/users/login', {
        title: "Đăng nhập tài khoản"
    });
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false,
        status: 'active'
    });
    if (!user) {
        req.flash('emailError', 'Email không tồn tại');
        req.flash('emailValue', email);
        res.redirect('back');
        return;
    }
    if (user.password != (0, md5_1.default)(password)) {
        req.flash('emailValue', email);
        req.flash('passwordError', 'Sai mật khẩu');
        res.redirect('back');
        return;
    }
    if (user.status != 'active') {
        req.flash('error', 'Tài khoản đã bị khóa');
        res.redirect('back');
        return;
    }
    inspector_1.console.log(user);
    res.cookie('tokenUser', user['tokenUser']);
    res.redirect('/');
});
exports.loginPost = loginPost;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('client/pages/users/register', {
        title: "Đăng nhập tài khoản"
    });
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName } = req.body;
    const existEmail = yield user_model_1.default.findOne({
        email: email,
        deleted: false,
        status: 'active'
    });
    inspector_1.console.log(existEmail);
    if (existEmail) {
        req.flash('emailError', "Email đã tồn tại");
        req.flash('emailValue', email);
        req.flash('nameValue', fullName);
        res.redirect('back');
        return;
    }
    req.body.password = (0, md5_1.default)(req.body.password);
    const user = new user_model_1.default(req.body);
    yield user.save();
    res.cookie("tokenUser", user.tokenUser);
    res.redirect('/');
});
exports.registerPost = registerPost;
const logout = (req, res) => {
    res.clearCookie('tokenUser');
    res.redirect('/');
};
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('client/pages/users/forgot-password', {
        title: "Lấy lại mật khẩu"
    });
});
exports.forgotPassword = forgotPassword;
const forgotPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false,
        status: 'active'
    });
    if (!user) {
        req.flash('emailError', `Email không tồn tại`);
        req.flash('emailValue', email);
        res.redirect('back');
        return;
    }
    const otp = generateHelper.generateRandomNumber(6);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };
    const forgotPassword = new forgor_password_model_1.default(objectForgotPassword);
    yield forgotPassword.save();
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP để lấy lại mật khẩu là <b>${otp}</b> .Thời gian sử dụng là 3 phút`;
    sendMailHelper.sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
});
exports.forgotPasswordPost = forgotPasswordPost;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    res.render('client/pages/users/otp-password', {
        title: "Nhập mã OTP",
        email: email
    });
});
exports.otpPassword = otpPassword;
const otpPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const existEmail = yield forgor_password_model_1.default.findOne({
        email: email
    });
    if (!existEmail) {
        req.flash('error', `Email không tồn tại`);
        res.redirect('back');
        return;
    }
    if (existEmail['otp'] !== otp) {
        req.flash('error', `OTP không hợp lệ`);
        res.redirect('back');
        return;
    }
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false,
        status: 'active'
    });
    if (!user) {
        req.flash('emailError', `Email không tồn tại`);
        req.flash('emailValue', email);
        res.redirect('back');
        return;
    }
    res.cookie('tokenUser', user['tokenUser']);
    res.redirect('/user/password/reset');
});
exports.otpPasswordPost = otpPasswordPost;
const reset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('client/pages/users/reset-password', {
        title: "Đổi mật khẩu",
    });
});
exports.reset = reset;
const resetPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    const user = yield user_model_1.default.findOne({
        tokenUser: tokenUser,
        deleted: false,
        status: 'active'
    });
    if (!user) {
        req.flash('emailError', `Nhập lại địa chỉ email!`);
        res.redirect(`/user/password/forgot`);
        return;
    }
    yield user_model_1.default.updateOne({
        tokenUser: tokenUser,
    }, {
        password: (0, md5_1.default)(password)
    });
    req.flash('success', `Đổi mật khẩu thành công`);
    res.redirect('back');
});
exports.resetPost = resetPost;
const myAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user) {
        res.locals.activePage = 'quan-ly';
        res.render('client/pages/my-account/management', {
            title: "Trang thông tin cá nhân"
        });
    }
    else {
        res.redirect('back');
    }
});
exports.myAccount = myAccount;
const managePlaylist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user) {
        res.locals.activePage = 'playlist';
        res.render('client/pages/my-account/management', {
            title: "Trang thông tin cá nhân"
        });
    }
    else {
        res.redirect('back');
    }
});
exports.managePlaylist = managePlaylist;
const listenHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user) {
        const countSongs = yield listen_history_model_1.default.countDocuments({
            userId: res.locals.user.id,
        });
        const objectPagination = (0, paginationHelper_1.default)(req.query, countSongs, {
            currentPage: 1,
            limitItems: 10
        });
        const songHistory = yield listen_history_model_1.default.find({
            userId: res.locals.user.id,
        })
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip);
        for (const item of songHistory) {
            const song = yield song_model_1.default.findOne({
                _id: item.songId
            });
            item['songInfo'] = song;
            const singer = yield singer_model_1.default.findOne({
                _id: song.singerId
            });
            item['singerInfo'] = singer;
        }
        res.locals.activePage = 'lich-su';
        res.render('client/pages/my-account/listen-history', {
            title: "Lịch sử nghe nhạc",
            songHistory: songHistory,
            pagination: objectPagination
        });
    }
    else {
        res.redirect('back');
    }
});
exports.listenHistory = listenHistory;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield listen_history_model_1.default.deleteOne({
        _id: id
    });
    req.flash('success', 'Đã xóa bài hát thành công');
    res.redirect('back');
});
exports.deleteItem = deleteItem;
const deleteMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    inspector_1.console.log(req.body.ids);
    let ids = req.body.ids.split(',').map((item) => item.trim());
    yield listen_history_model_1.default.deleteMany({
        _id: { $in: ids }
    });
    req.flash('success', `Xóa thành công ${ids.length} bài hát`);
    res.redirect('back');
});
exports.deleteMulti = deleteMulti;
const editAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user) {
        res.locals.activePage = 'quan-ly';
        res.render('client/pages/my-account/edit-account', {
            title: "Trang cập nhật tài khoản"
        });
    }
    else {
        res.redirect('back');
    }
});
exports.editAccount = editAccount;
const editAccountPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user) {
        res.locals.activePage = 'quan-ly';
        yield user_model_1.default.updateOne({
            _id: res.locals.user.id,
            deleted: false
        }, req.body);
        req.flash('success', `Cập nhật thành công`);
        res.redirect('back');
    }
    else {
        res.redirect('back');
    }
});
exports.editAccountPatch = editAccountPatch;
