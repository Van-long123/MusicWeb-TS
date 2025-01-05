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
const home_route_1 = require("./home.route");
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const search_route_1 = require("./search.route");
const user_route_1 = require("./user.route");
const artist_route_1 = require("./artist.route");
const playlist_route_1 = require("./playlist.route");
const favorite_song_route_1 = require("./favorite-song.route");
const userMiddleware = __importStar(require("../../middlewares/client/infoUser.middleware"));
const settingMiddleware = __importStar(require("../../middlewares/client/setting.middleware"));
const clientRoutes = (app) => {
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.settingGeneral);
    app.use('/', home_route_1.homeRoutes);
    app.use('/topics', topic_route_1.topicRouter);
    app.use('/songs', song_route_1.songRouter);
    app.use('/search', search_route_1.searchRouter);
    app.use('/user', user_route_1.userRouter);
    app.use('/favorite-songs', favorite_song_route_1.favoriteSongRoutes);
    app.use('/artist', artist_route_1.artistRouter);
    app.use('/playlist', playlist_route_1.playlistRouter);
};
exports.default = clientRoutes;
