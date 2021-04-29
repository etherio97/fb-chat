"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var DB_1 = __importDefault(require("./DB"));
var GraphAPI_1 = __importDefault(require("./GraphAPI"));
var Receive_1 = __importDefault(require("./Receive"));
var Report_1 = __importDefault(require("./Report"));
var Response_1 = __importDefault(require("./Response"));
var APP_URL = process.env.APP_URL;
var updated_at;
var News = (function () {
    function News(user, webhookEvent) {
        if (webhookEvent === void 0) { webhookEvent = null; }
        this.user = user;
        this.webhookEvent = webhookEvent;
    }
    News.prototype.update = function () {
        var _this = this;
        return this.updateHeadlines().then(function (headlines) {
            return _this.updateArticles().then(function (articles) {
                updated_at = Date.now();
                articles.forEach(function (article) {
                    var headline = headlines.find(function (headline) { return headline["title"] == article.title; });
                    if (headline) {
                        article.datetime = headline["datetime"];
                        article.timestamp = headline["timestamp"];
                    }
                    else {
                        article.datetime = new Date();
                        article.timestamp = Date.now();
                    }
                });
                return articles;
            });
        });
    };
    News.prototype.updateHeadlines = function () {
        return axios_1.default
            .get("https://api.nweoo.com/news/headlines")
            .then(function (_a) {
            var data = _a.data;
            return Object.values(data);
        });
    };
    News.prototype.updateArticles = function () {
        return axios_1.default.get("https://api.nweoo.com/articles").then(function (_a) {
            var data = _a.data;
            return data;
        });
    };
    News.prototype.fetchAll = function () {
        var _this = this;
        var diff = Date.now() - updated_at;
        return new Promise(function (resolve, reject) {
            if (diff < 3000000) {
                resolve(DB_1.default.read()["articles"]);
            }
            else {
                _this.update()
                    .then(function (articles) {
                    var db = DB_1.default.read();
                    db.articles = articles;
                    DB_1.default.save(db);
                    resolve(articles);
                })
                    .catch(function (e) { return reject(e); });
            }
        });
    };
    News.prototype.handleNews = function () {
        this.fetchAll();
        var response;
        var user = this.user;
        var read = user.headlines;
        var articles = DB_1.default.read()["articles"] || [];
        articles = articles.filter(function (article) { return !read.includes(article.id); });
        if (articles.length) {
            var article = articles[0];
            response = [
                Response_1.default.genGenericTemplate(article.image, article.title, article.source, [
                    Response_1.default.genWebUrlButton("အပြည့်အစုံ", APP_URL + "/articles/" + article.id),
                    Response_1.default.genPostbackButton("နောက်ထပ်", "NEWS_ANOTHER"),
                ]),
            ];
            read.push(article.id);
        }
        else {
            response = Response_1.default.genText("သတင်းများနောက်ထပ်မရှိပါ။");
        }
        return response;
    };
    News.prototype.handlePayload = function (payload) {
        var _this = this;
        var _a;
        var response;
        switch (payload) {
            case "NEWS_REPORT_DELETE":
                if (this.user.mode === "delete") {
                    var message_1 = ((_a = this.webhookEvent.message) === null || _a === void 0 ? void 0 : _a.text) || "";
                    this.user.mode = null;
                    if (this.user.reports.includes(message_1)) {
                        this.user.reports = this.user.reports.filter(function (id) { return id != message_1; });
                        response = [];
                        Report_1.default.remove(message_1, this.user.psid)
                            .then(function () {
                            return GraphAPI_1.default.callSendAPI(Response_1.default.genQuickReply('ပေးပို့ချက် "' + message_1 + '" ကို ဖျက်လိုက်ပါပြီ။', [
                                {
                                    title: "ပြန်လည်စတင်ရန်",
                                    payload: "GETTING_START",
                                },
                            ]));
                        })
                            .catch(function (e) {
                            var receive = new Receive_1.default(_this.user, _this.webhookEvent);
                            receive.sendMessage(Response_1.default.genButtonTemplate("နည်းပညာပိုင်းအရ ဖျက်တာမအောင်မြင်ပါဘူးဗျာ။ အောက်ဖော်ပြပါလင့်ခ်ကတဆင့်`ဖျက်ပေးပါခင်ဗျာ။", [
                                Response_1.default.genWebUrlButton("ဝင်ရောက်ရန်", "https://www.nweoo.com/report/" + message_1 + "?action=delete&phone=" + _this.user.psid),
                            ]));
                        });
                    }
                }
                else {
                    if (this.user.reports.length) {
                        response = [
                            Response_1.default.genQuickReply("ဖျက်လိုတဲ့ ID ကို ထည့်သွင်းပါ။", __spreadArray([], this.user.reports.map(function (id) { return ({
                                title: id,
                                payload: "NEWS_REPORT_DELETE",
                            }); }))),
                        ];
                    }
                    else {
                        response = [Response_1.default.genText("ဖျက်လိုတဲ့ ID ထည့်သွင်းပါ။")];
                    }
                    this.user.mode = "delete";
                }
                break;
            case "NEWS_ANOTHER":
                response = this.handleNews();
                break;
            case "NEWS_GETTING":
                response = [
                    Response_1.default.genQuickReply("ဘယ်လိုသတင်းများကိုရယူလိုပါသလဲ။", [
                        {
                            title: "SMS",
                            payload: "NEWS_GETTING_SMS",
                        },
                        {
                            title: "Messenger",
                            payload: "NEWS_GETTING_MESSENGER",
                        },
                    ]),
                ];
                break;
            case "NEWS_REPORTING":
                response = [
                    Response_1.default.genQuickReply("ဘယ်လိုသတင်းပေးလိုပါသလဲ။", [
                        {
                            title: "SMS",
                            payload: "NEWS_REPORTING_SMS",
                        },
                        {
                            title: "Messenger",
                            payload: "NEWS_REPORTING_MESSENGER",
                        },
                    ]),
                ];
                break;
            case "NEWS_GETTING_SMS":
                response = [
                    Response_1.default.genQuickReply("တယ်လီနောအသုံးပြုသူများအနေနဲ့ 09758035929 ကို news (သို့) သတင်း လို့ SMS ပေးပို့ပြီး သတင်းခေါင်းစဉ်များကိုရယူနိုင်ပါတယ်။", [{ title: "Messenger", payload: "NEWS_GETTING_MESSENGER" }]),
                ];
                break;
            case "NEWS_GETTING_MESSENGER":
                response = [
                    Response_1.default.genQuickReply("ဒီကနေ news (သို့) သတင်း လို့ပို့ပြီး သတင်းများကိုရယူနိုင်ပါတယ်။", [
                        { title: "SMS", payload: "NEWS_GETTING_SMS" },
                        { title: "သတင်း", payload: "NEWS_ANOTHER" },
                    ]),
                ];
                break;
            case "NEWS_REPORTING_SMS":
                response = [
                    Response_1.default.genText("ဖုန်းနံပါတ် 09758035929 ကို #nweoo ထည့်ပြီး သတင်းအချက်အလက်တွေကို SMS နဲ့ပေးပို့လိုက်တာနဲ့ အမြန်ဆုံးကျွန်တော်တို့ Page ပေါ်တင်ပေးသွားမှာဖြစ်ပါတယ်။"),
                ];
                break;
            case "NEWS_REPORTING_MESSENGER":
                response = [
                    Response_1.default.genText("ဒီကနေ #nweoo ထည့်ပြီး သတင်းအချက်အလက်တွေကို ပို့လိုက်တာနဲ့ ချက်ချင်းကျွန်တော်တို့ရဲ့ Page ပေါ်တင်ပေးသွားမှာဖြစ်ပါတယ်။"),
                ];
                break;
        }
        return response;
    };
    return News;
}());
exports.default = News;
