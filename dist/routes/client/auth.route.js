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
exports.authRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const passport_1 = __importDefault(require("passport"));
const user_model_1 = __importDefault(require("../../models/user.model"));
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', (req, res, next) => {
    passport_1.default.authenticate('google', (err, profile) => {
        req['user'] = profile;
        next();
    })(req, res, next);
}, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req['user']) {
        res.redirect('/user/login');
        return;
    }
    const user = yield user_model_1.default.findOne({
        _id: req['user'].id
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect('/');
}));
exports.authRouter = router;
