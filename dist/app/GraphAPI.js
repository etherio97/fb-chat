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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var request_1 = __importDefault(require("request"));
var camelcase_1 = __importDefault(require("camelcase"));
var _a = process.env, APP_ID = _a.APP_ID, APP_SECRET = _a.APP_SECRET, APP_URL = _a.APP_URL, PAGE_ID = _a.PAGE_ID, PAGE_ACCESS_TOKEN = _a.PAGE_ACCESS_TOKEN, VERIFY_TOKEN = _a.VERIFY_TOKEN;
var GraphAPI = (function () {
    function GraphAPI() {
    }
    GraphAPI.callSendAPI = function (requestBody) {
        var uri = new URL("https://graph.facebook.com/v10.0/me/messages");
        var search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        return axios_1.default
            .post(uri.toString(), requestBody)
            .then(function (_a) {
            var data = _a.data;
            return data;
        })
            .catch(function (e) { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.messages); });
    };
    GraphAPI.callMessengerProfileAPI = function (requestBody) {
        var uri = new URL("https://graph.facebook.com/v10.0/me/messenger_profile");
        var search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        return axios_1.default
            .post(uri.toString(), requestBody)
            .then(function (_a) {
            var data = _a.data;
            return data;
        })
            .catch(function (e) { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.messages); });
    };
    GraphAPI.callSubscriptionsAPI = function (customFields) {
        var fields = "messages, messaging_postbacks, messaging_optins, \
        message_deliveries, messaging_referrals";
        if (customFields !== undefined) {
            fields = fields + ", " + customFields;
        }
        var uri = new URL("https://graph.facebook.com/v10.0/" + APP_ID + "/subscriptions");
        var search = uri.searchParams;
        search.append("access_token", APP_ID + "|" + APP_SECRET);
        search.append("object", "page");
        search.append("callback_url", APP_URL + "/webhook");
        search.append("verify_token", VERIFY_TOKEN);
        return axios_1.default
            .post(uri.toString(), customFields)
            .then(function (_a) {
            var data = _a.data;
            return data;
        })
            .catch(function (e) { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.messages); });
    };
    GraphAPI.callSubscribedApps = function (customFields) {
        var fields = "messages, messaging_postbacks, messaging_optins, \
        message_deliveries, messaging_referrals";
        if (customFields !== undefined) {
            fields = fields + ", " + customFields;
        }
        var uri = new URL("https://graph.facebook.com/v10.0/me/subscribed_apps");
        var search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        search.append("subscribed_fields", fields);
        return axios_1.default
            .post(uri.toString())
            .then(function (_a) {
            var data = _a.data;
            return data;
        })
            .catch(function (e) { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.messages); });
    };
    GraphAPI.getUserProfile = function (senderPsid) {
        return __awaiter(this, void 0, void 0, function () {
            var userProfile, key, camelizedKey, value, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.callUserProfileAPI(senderPsid)];
                    case 1:
                        userProfile = _a.sent();
                        for (key in userProfile) {
                            camelizedKey = camelcase_1.default(key);
                            value = userProfile[key];
                            delete userProfile[key];
                            userProfile[camelizedKey] = value;
                        }
                        return [2, userProfile];
                    case 2:
                        err_1 = _a.sent();
                        console.log("Fetch failed:", err_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    GraphAPI.callUserProfileAPI = function (psid) {
        var uri = new URL("https://graph.facebook.com/v10.0/" + psid);
        var search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        search.append("fields", "first_name, last_name, gender");
        return axios_1.default
            .get(uri.toString())
            .then(function (_a) {
            var data = _a.data;
            return data;
        })
            .catch(function (e) { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message); });
    };
    GraphAPI.getPersonaAPI = function () {
        var uri = new URL("https://graph.facebook.com/v10.0/personas");
        var search = uri.searchParams;
        search.append("access_token", PAGE_ACCESS_TOKEN);
        return axios_1.default
            .get(uri.toString())
            .then(function (_a) {
            var data = _a.data;
            return data["data"];
        })
            .catch(function (e) { var _a; return console.log(((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message); });
    };
    GraphAPI.postPersonaAPI = function (name, profile_picture_url) {
        var body = [];
        return new Promise(function (resolve, reject) {
            var requestBody = { name: name, profile_picture_url: profile_picture_url };
            request_1.default({
                uri: "https://graph.facebook.com/v10.0/me/personas",
                qs: {
                    access_token: PAGE_ACCESS_TOKEN,
                },
                method: "POST",
                json: requestBody,
            })
                .on("response", function (response) {
                if (response.statusCode !== 200) {
                    reject(Error(response.statusCode));
                }
            })
                .on("data", function (chunk) {
                body.push(chunk);
            })
                .on("error", function (error) {
                console.error("Unable to create a persona:", error);
                reject(Error("Network Error"));
            })
                .on("end", function () {
                body = Buffer.concat(body).toString();
                resolve(JSON.parse(body).id);
            });
        }).catch(function (error) {
            console.error("Unable to create a persona:", error, body);
        });
    };
    GraphAPI.callNLPConfigsAPI = function () {
        request_1.default({
            uri: "https://graph.facebook.com/v10.0/me/nlp_configs",
            qs: {
                access_token: PAGE_ACCESS_TOKEN,
                nlp_enabled: true,
            },
            method: "POST",
        }, function (error, _res, body) {
            if (!error) {
                console.log("Request sent:", body);
            }
            else {
                console.error("Unable to activate built-in NLP:", error);
            }
        });
    };
    GraphAPI.callFBAEventsAPI = function (senderPsid, eventName) {
        var requestBody = {
            event: "CUSTOM_APP_EVENTS",
            custom_events: JSON.stringify([
                {
                    _eventName: "postback_payload",
                    _value: eventName,
                    _origin: "original_coast_clothing",
                },
            ]),
            advertiser_tracking_enabled: 1,
            application_tracking_enabled: 1,
            extinfo: JSON.stringify(["mb1"]),
            page_id: PAGE_ID,
            page_scoped_user_id: senderPsid,
        };
        request_1.default({
            uri: "https://graph.facebook.com/v10.0/" + APP_ID + "/activities",
            method: "POST",
            form: requestBody,
        }, function (error) {
            if (!error) {
                console.log("FBA event '" + eventName + "'");
            }
            else {
                console.error("Unable to send FBA event '" + eventName + "':" + error);
            }
        });
    };
    return GraphAPI;
}());
exports.default = GraphAPI;
