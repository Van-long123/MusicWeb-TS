"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', `Vui lòng nhập tiêu đề`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.topicId) {
        req.flash('error', `Vui lòng chọn chủ để`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.singerId) {
        req.flash('error', `Vui lòng chọn ca sĩ`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.lyrics) {
        req.flash('error', `Vui lòng nhập lời bài hát`);
        res.redirect(`back`);
        return;
    }
    if (!req.body.description) {
        req.flash('error', `Vui lòng nhập mô tả`);
        res.redirect(`back`);
        return;
    }
    next();
};
exports.createPost = createPost;
