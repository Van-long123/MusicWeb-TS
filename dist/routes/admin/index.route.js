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
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_route_1 = require("./dashboard.route");
const song_route_1 = require("./song.route");
const role_route_1 = require("./role.route");
const topic_route_1 = require("./topic.route");
const singer_route_1 = require("./singer.route");
const account_route_1 = require("./account.route");
const user_route_1 = require("./user.route");
const setting_route_1 = require("./setting.route");
const auth_route_1 = require("./auth.route");
const my_account_route_1 = require("./my-account.route");
const authMiddleware = __importStar(require("../../middlewares/admin/auth.middleware"));
const adminRoutes = (app) => {
    const PATH_ADMIN = '/admin';
    app.use(PATH_ADMIN + '/dashboard', authMiddleware.requireAuth, dashboard_route_1.dashboardRoutes);
    app.use(PATH_ADMIN + '/songs', authMiddleware.requireAuth, song_route_1.songRoutes);
    app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, role_route_1.roleRoutes);
    app.use(PATH_ADMIN + '/topics', authMiddleware.requireAuth, topic_route_1.topicRouter);
    app.use(PATH_ADMIN + '/singers', authMiddleware.requireAuth, singer_route_1.singerRouter);
    app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, account_route_1.accountRouter);
    app.use(PATH_ADMIN + '/users', authMiddleware.requireAuth, user_route_1.userRouter);
    app.use(PATH_ADMIN + '/settings', authMiddleware.requireAuth, setting_route_1.settingRouter);
    app.use(PATH_ADMIN + '/my-account', authMiddleware.requireAuth, my_account_route_1.myAccountRouter);
    app.use(PATH_ADMIN + '/auth', auth_route_1.authRouter);
};
exports.default = adminRoutes;
