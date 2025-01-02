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
exports.index = void 0;
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slugArtist;
        const artist = yield singer_model_1.default.findOne({
            slug: slug
        });
        if (!artist) {
            return res.redirect('/');
        }
        const songsFeatured = yield song_model_1.default.find({
            singerId: artist.id
        }).sort({
            'createdBy.createdAt': 'desc'
        }).limit(6);
        const songs = yield song_model_1.default.find({
            singerId: artist.id
        }).sort({
            'createdBy.createdAt': 'asc'
        });
        if (songs.length < 1 || songsFeatured.length < 1) {
            return res.redirect('/');
        }
        res.render('client/pages/artists/index', {
            artist: artist,
            songsFeatured: songsFeatured,
            songs: songs
        });
    }
    catch (error) {
        res.redirect('/');
    }
});
exports.index = index;
