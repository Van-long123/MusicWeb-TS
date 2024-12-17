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
exports.generalPatch = exports.general = void 0;
const settings_general_model_1 = __importDefault(require("../../models/settings-general.model"));
const general = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("settings_view")) {
        return;
    }
    try {
        const settingGeneral = yield settings_general_model_1.default.findOne({});
        res.render('admin/pages/settings/general', {
            title: "Cài đặt chung",
            settingGeneral: settingGeneral
        });
    }
    catch (error) {
    }
});
exports.general = general;
const generalPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissions = res.locals.role.permissions;
    if (!permissions.includes("settings_edit")) {
        return;
    }
    const settingGeneral = yield settings_general_model_1.default.findOne({});
    if (settingGeneral) {
        yield settings_general_model_1.default.updateOne({
            _id: settingGeneral.id
        }, req.body);
    }
    else {
        const settingGeneral = new settings_general_model_1.default(req.body);
        yield settingGeneral.save();
    }
    res.redirect('back');
});
exports.generalPatch = generalPatch;
