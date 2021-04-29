"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Report = (function () {
    function Report() {
    }
    Report.send = function (phone, message) {
        message = message.replace(/#n[we]{2}oo/gim, "");
        return axios_1.default.post("https://api.nweoo.com/report", {
            phone: phone,
            message: message,
            timestamp: Date.now(),
        }).then(function (_a) {
            var _b = _a.data, id = _b.id, post_id = _b.post_id;
            return ({
                id: id.toString(),
                post_id: post_id,
            });
        });
    };
    Report.remove = function (id) {
        return axios_1.default.delete("https://api.nweoo.com/report/" + id)
            .then(function (_a) {
            var data = _a.data;
            return data;
        })
            .catch(function (e) {
            var _a;
            throw new Error(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message);
        });
    };
    return Report;
}());
exports.default = Report;
