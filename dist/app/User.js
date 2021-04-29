"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = (function () {
    function User(psid) {
        this.psid = psid;
        this.firstName = "";
        this.lastName = "";
        this.locale = null;
        this.gender = null;
        this.last_report = null;
        this.headlines = [];
        this.reports = [];
    }
    User.prototype.setProfile = function (profile) {
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.locale = profile.locale;
        if (profile.gender) {
            this.gender = profile.gender;
        }
    };
    Object.defineProperty(User.prototype, "name", {
        get: function () {
            if (!this.firstName) {
                return "";
            }
            if (!this.gender) {
                return this.firstName + " " + this.lastName;
            }
            var sur = this.gender.toLowerCase().includes("female") ? "မ" : "ကို";
            return "" + sur + this.firstName + " " + this.lastName;
        },
        enumerable: false,
        configurable: true
    });
    return User;
}());
exports.default = User;
