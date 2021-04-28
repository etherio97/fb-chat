"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var GraphAPI_1 = __importDefault(require("./GraphAPI"));
var _a = process.env, APP_URL = _a.APP_URL, SHOP_URL = _a.SHOP_URL;
var Profile = (function () {
    function Profile(user) {
        this.user = user;
    }
    Profile.prototype.setWebhook = function () {
        GraphAPI_1.default.callSubscriptionsAPI("");
        GraphAPI_1.default.callSubscribedApps("");
    };
    Profile.prototype.setPageFeedWebhook = function () {
        GraphAPI_1.default.callSubscriptionsAPI("feed");
        GraphAPI_1.default.callSubscribedApps("feed");
    };
    Profile.prototype.setThread = function () {
        var profilePayload = __assign(__assign(__assign({}, this.getGetStarted()), this.getGreeting()), this.getPersistentMenu());
        GraphAPI_1.default.callMessengerProfileAPI(profilePayload);
    };
    Profile.prototype.setGetStarted = function () {
        var getStartedPayload = this.getGetStarted();
        GraphAPI_1.default.callMessengerProfileAPI(getStartedPayload);
    };
    Profile.prototype.setGreeting = function () {
        var greetingPayload = this.getGreeting();
        GraphAPI_1.default.callMessengerProfileAPI(greetingPayload);
    };
    Profile.prototype.setPersistentMenu = function () {
        var menuPayload = this.getPersistentMenu();
        GraphAPI_1.default.callMessengerProfileAPI(menuPayload);
    };
    Profile.prototype.setWhitelistedDomains = function () {
        var domainPayload = this.getWhitelistedDomains();
        GraphAPI_1.default.callMessengerProfileAPI(domainPayload);
    };
    Profile.prototype.getGetStarted = function () {
        return {
            get_started: {
                payload: "GET_STARTED",
            },
        };
    };
    Profile.prototype.getGreeting = function () {
        var greetings = [this.getGreetingText()];
        return {
            greeting: greetings,
        };
    };
    Profile.prototype.getPersistentMenu = function () {
        var menuItems = [this.getMenuItems()];
        return {
            persistent_menu: menuItems,
        };
    };
    Profile.prototype.getGreetingText = function () {
        return {
            locale: "default",
            text: "မင်္ဂလာပါ",
        };
    };
    Profile.prototype.getMenuItems = function () {
        return {
            locale: "default",
            composer_input_disabled: false,
            call_to_actions: [
                {
                    type: "postback",
                    title: "သတင်းရယူရန်",
                    payload: "NEWS_GETTING",
                },
                {
                    type: "postback",
                    title: "သတင်းပေးပို့ရန်",
                    payload: "NEWS_REPORTING",
                },
                {
                    type: "web_url",
                    title: "Website",
                    url: SHOP_URL,
                    webview_height_ratio: "full",
                },
            ],
        };
    };
    Profile.prototype.getWhitelistedDomains = function () {
        return {
            whitelisted_domains: [APP_URL, SHOP_URL],
        };
    };
    return Profile;
}());
exports.default = Profile;
