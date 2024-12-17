"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertToSlug_1 = require("./convertToSlug");
const search = (query) => {
    let objectSearch = {
        keyword: ""
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword,
            objectSearch['keywordRegex'] = new RegExp(query.keyword, 'i');
        objectSearch['slugRegex'] = new RegExp((0, convertToSlug_1.convertToSlug)(query.keyword), 'i');
    }
    return objectSearch;
};
exports.default = search;
