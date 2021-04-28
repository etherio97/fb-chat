"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = (function () {
    function User(psid) {
        this.psid = psid;
        this.firstName = "";
        this.lastName = "";
        this.locale = "";
        this.timezone = "";
        this.gender = undefined;
        this.headlines = [];
    }
    User.prototype.setProfile = function (profile) {
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.locale = profile.locale;
        this.timezone = profile.timezone;
        if (profile.gender) {
            this.gender = profile.gender;
        }
    };
    return User;
}());
exports.default = User;
