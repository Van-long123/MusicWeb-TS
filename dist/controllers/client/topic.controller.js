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
exports.topics = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const paginationHelper_1 = __importDefault(require("../../helpers/paginationHelper"));
const topics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const countTopics = yield topic_model_1.default.countDocuments({});
    const objectPagination = (0, paginationHelper_1.default)(req.query, countTopics, {
        currentPage: 1,
        limitItems: 14
    });
    const topics = yield topic_model_1.default.find({
        status: 'active',
        deleted: false,
    })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render('client/pages/topics/index', {
        title: "Chủ đề bài hát",
        topics: topics,
        pagination: objectPagination
    });
});
exports.topics = topics;
