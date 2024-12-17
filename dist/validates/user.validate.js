"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPost = exports.createPost = exports.resetPasswordPost = exports.forgotPassword = exports.registerPost = exports.loginPost = void 0;
const loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash('emailError', `Vui lòng nhập email`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.password) {
        req.flash('emailValue', req.body.email);
        req.flash('passwordError', `Vui lòng nhập mật khẩu`);
        res.redirect(`back`);
        return;
    }
    next();
};
exports.loginPost = loginPost;
const registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('nameError', `Vui lòng nhập họ tên`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.phone) {
        req.flash('phoneError', `Vui lòng nhập số điện thoại`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.address) {
        req.flash('addressError', `Vui lòng nhập địa chỉ`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.email) {
        req.flash('emailError', `Vui lòng nhập email`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.password) {
        req.flash('passwordError', `Vui lòng nhập mật khẩu`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash('confirmPassword-error', `Vui lòng nhập xác nhận mật khẩu`);
        res.redirect(`back`);
        return;
    }
    if (req.body.password != req.body.confirmPassword) {
        req.flash('emailValue', req.body.email);
        req.flash('nameValue', req.body.fullName);
        req.flash('passwordError', `Mật khẩu không khớp`);
        res.redirect(`back`);
        return;
    }
    next();
};
exports.registerPost = registerPost;
const forgotPassword = (req, res, next) => {
    if (!req.body.email) {
        if (!req.body.email) {
            req.flash('emailError', `Vui lòng nhập email`);
            res.redirect(`back`);
            return;
        }
    }
    next();
};
exports.forgotPassword = forgotPassword;
const resetPasswordPost = (req, res, next) => {
    if (!req.body.password) {
        req.flash('passwordError', `Vui lòng nhập mật khẩu`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash('confirmError', `Vui lòng nhập xác nhận mật khẩu`);
        req.flash('passValue', req.body.password);
        res.redirect(`back`);
        return;
    }
    if (req.body.password != req.body.confirmPassword) {
        req.flash('passwordError', `Mật khẩu không khớp`);
        req.flash('passValue', req.body.password);
        res.redirect(`back`);
        return;
    }
    next();
};
exports.resetPasswordPost = resetPasswordPost;
const createPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', `Vui lòng nhập họ và tên`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.email) {
        req.flash('error', `Vui lòng nhập email`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.phone) {
        req.flash('error', `Vui lòng nhập số điện thoại`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.address) {
        req.flash('error', `Vui lòng nhập địa chỉ`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.password) {
        req.flash('error', `Vui lòng nhập mật khẩu`);
        res.redirect(`back`);
        return;
    }
    next();
};
exports.createPost = createPost;
const editPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', `Vui lòng nhập họ và tên`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.email) {
        req.flash('error', `Vui lòng nhập email`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.phone) {
        req.flash('error', `Vui lòng nhập số điện thoại`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.address) {
        req.flash('error', `Vui lòng nhập địa chỉ`);
        res.redirect(`back`);
        return;
    }
    next();
};
exports.editPost = editPost;
