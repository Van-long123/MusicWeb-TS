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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const controller = __importStar(require("../../controllers/client/user.controller"));
const validate = __importStar(require("../../validates/user.validate"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const uploadCloud = __importStar(require("../../middlewares/admin/uploadCloud.middleware"));
const router = (0, express_1.Router)();
router.get('/login', controller.login);
router.post('/login', validate.loginPost, controller.loginPost);
router.get('/register', controller.register);
router.post('/register', validate.registerPost, controller.registerPost);
router.get('/logout', controller.logout);
router.get('/password/forgot', controller.forgotPassword);
router.post('/password/forgot', validate.forgotPassword, controller.forgotPasswordPost);
router.get('/password/otp', controller.otpPassword);
router.post('/password/otp', controller.otpPasswordPost);
router.get('/password/reset', controller.reset);
router.post('/password/reset', validate.resetPasswordPost, controller.resetPost);
router.get('/manage-account', controller.myAccount);
router.get('/listening-history', controller.listenHistory);
router.get('/manage-my-playlists', controller.managePlaylist);
router.get('/edit-account', controller.editAccount);
router.patch('/edit-account', upload.single('avatar'), uploadCloud.uploadSingle, controller.editAccountPatch);
router.delete('/song/delete/:id', controller.deleteItem);
router.delete('/song/delete-multi', controller.deleteMulti);
exports.userRouter = router;
