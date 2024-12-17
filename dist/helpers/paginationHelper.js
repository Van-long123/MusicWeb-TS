"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination = (query, countSongs, objectPagination) => {
    const totalPage = Math.ceil(countSongs / objectPagination.limitItems);
    objectPagination.totalPage = totalPage;
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    return objectPagination;
};
exports.default = pagination;
