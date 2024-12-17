"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fillterStatusHelper = (query) => {
    let fillterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];
    if (query.status) {
        const element = fillterStatus.find(item => {
            return item.status == query.status;
        });
        element.class = 'active';
    }
    else {
        const element = fillterStatus.find(item => {
            return item.status == "";
        });
        element.class = 'active';
    }
    return fillterStatus;
};
exports.default = fillterStatusHelper;
