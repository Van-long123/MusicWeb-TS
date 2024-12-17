"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const listenHistorySchema = new mongoose_1.default.Schema({
    userId: String,
    songId: String,
    listenedAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
});
const ListenHistory = mongoose_1.default.model('ListenHistory', listenHistorySchema, 'listen-history');
exports.default = ListenHistory;
