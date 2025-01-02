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
exports.duration = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffprobe_static_1 = __importDefault(require("ffprobe-static"));
const duration = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    fluent_ffmpeg_1.default.setFfprobePath(ffprobe_static_1.default.path);
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)(fileUrl).ffprobe((err, metadata) => {
            if (err) {
                return reject(`Error: ${err.message}`);
            }
            const durationInSeconds = metadata.format.duration;
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = Math.floor(durationInSeconds % 60);
            resolve(`${minutes}:${seconds}`);
        });
    });
});
exports.duration = duration;
