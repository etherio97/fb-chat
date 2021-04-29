"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Response_1 = __importDefault(require("./Response"));
var News_1 = __importDefault(require("./News"));
var GraphAPI_1 = __importDefault(require("./GraphAPI"));
var Report_1 = __importDefault(require("./Report"));
var Receive = (function () {
    function Receive(user, webhookEvent) {
        if (webhookEvent === void 0) { webhookEvent = null; }
        this.user = user;
        this.webhookEvent = webhookEvent;
    }
    Receive.prototype.handleMessage = function () {
        var responses;
        var event = this.webhookEvent;
        try {
            if (event.message) {
                var message = event.message;
                if (message.quick_reply) {
                    responses = this.handleQuickReply();
                }
                else if (message.attachments) {
                    responses = this.handleAttachmentMessage();
                }
                else if (message.text) {
                    responses = this.handleTextMessage();
                }
            }
            else if (event.postback) {
                responses = this.handlePostback();
            }
            else if (event.referral) {
                responses = this.handleReferral();
            }
        }
        catch (error) {
            responses = {
                text: "\u1014\u100A\u103A\u1038\u1015\u100A\u102C\u1015\u102D\u102F\u1004\u103A\u1038\u1021\u101B\u1001\u103B\u102D\u102F\u1037\u101A\u103D\u1004\u103A\u1038\u1014\u1031\u1015\u102B\u1010\u101A\u103A\u104B \n\n---\n" + error,
            };
        }
        if (Array.isArray(responses)) {
            var delay = 0;
            for (var _i = 0, responses_1 = responses; _i < responses_1.length; _i++) {
                var response = responses_1[_i];
                this.sendMessage(response, delay * 2000);
                delay++;
            }
        }
        else {
            this.sendMessage(responses);
        }
    };
    Receive.prototype.handleTextMessage = function () {
        var _this = this;
        var greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");
        var message = this.webhookEvent.message.text.trim().toLowerCase();
        var response;
        if (message.match(/(?:news|သတင်း|သတငျး|ဘာထူးလဲ)/)) {
            var news = new News_1.default(this.user, this.webhookEvent);
            response = news.handleNews();
        }
        else if (message.match(/#n[we]{2}oo/gim)) {
            var phone = "" + (this.user.firstName || this.user.lastName || this.user.psid);
            Report_1.default.send(phone, message).then(function (_a) {
                var id = _a.id, post_id = _a.post_id;
                _this.user.reports.push(id);
                _this.user.last_report = new Date().getTime();
                _this.sendMessage(Response_1.default.genButtonTemplate("\u1015\u1031\u1038\u1015\u102D\u102F\u1037\u1001\u103B\u1000\u103A ID \u1019\u103E\u102C " + id + " \u1016\u103C\u1005\u103A\u1015\u102B\u1010\u101A\u103A\u104B https://www.facebook.com/" + post_id + " \u1019\u103E\u102C\u1040\u1004\u103A\u101B\u1031\u102C\u1000\u103A\u1000\u103C\u100A\u103A\u1037\u101B\u103E\u102F\u1014\u102D\u102F\u1004\u103A\u1015\u102B\u1010\u101A\u103A\u104B", [
                    Response_1.default.genWebUrlButton("ကြည့်ရှုရန်", "https://nweoo.com/reports/" + id),
                    Response_1.default.genPostbackButton("ပြန်ဖျက်ရန်", "NEWS_REPORT_DELETE"),
                ]));
            });
            response = Response_1.default.genText("အခုလိုသတင်းပေးတဲအတွက်ကျေးဇူးတင်ပါတယ်။");
        }
        else if ((greeting && greeting.confidence > 0.8) ||
            message.match(/(?:hello|hi|ဟယ်လို|ဟိုင်း|မင်္ဂလာ|mingala)/g)) {
            response = Response_1.default.genNuxMessage(this.user);
        }
        else {
            response = [
                Response_1.default.genQuickReply("ဘာများကူညီပေးရမလဲခင်ဗျ။", [
                    {
                        title: "သတင်းယူ",
                        payload: "NEWS_GETTING",
                    },
                    {
                        title: "သတင်းပေး",
                        payload: "NEWS_REPORTING",
                    },
                ]),
            ];
        }
        return response;
    };
    Receive.prototype.handleAttachmentMessage = function () {
        var response;
        var attachment = this.webhookEvent.message.attachments[0];
        response = Response_1.default.genQuickReply("အခုလိုဆက်သွယ်တဲ့အတွက် ကျေးဇူးတင်ရှိပါတယ်ခင်ဗျာ...", [
            {
                title: "ပြန်လည်စတင်ရန်",
                payload: "GET_STARTED",
            },
        ]);
        return response;
    };
    Receive.prototype.handleQuickReply = function () {
        var payload = this.webhookEvent.message.quick_reply.payload;
        return this.handlePayload(payload);
    };
    Receive.prototype.handlePostback = function () {
        var payload;
        var postback = this.webhookEvent.postback;
        if (postback.referral && postback.referral.type == "OPEN_THREAD") {
            payload = postback.referral.ref;
        }
        else {
            payload = postback.payload;
        }
        return this.handlePayload(payload.toUpperCase());
    };
    Receive.prototype.handleReferral = function () {
        var payload = this.webhookEvent.referral.ref.toUpperCase();
        return this.handlePayload(payload);
    };
    Receive.prototype.handlePayload = function (payload) {
        GraphAPI_1.default.callFBAEventsAPI(this.user.psid, payload);
        var response;
        if (payload === "GET_STARTED" ||
            payload === "DEVDOCS" ||
            payload === "GITHUB") {
            response = Response_1.default.genNuxMessage(this.user);
        }
        else if (payload.includes("NEWS")) {
            var news = new News_1.default(this.user, this.webhookEvent);
            response = news.handlePayload(payload);
        }
        else if (payload.includes("CHAT-PLUGIN")) {
            response = [
                Response_1.default.genText("မင်္ဂလာပါ " + this.user.name),
                Response_1.default.genQuickReply("ဘာများကူညီပေးရမလဲခင်ဗျ။", [
                    {
                        title: "သတင်းယူရန်",
                        payload: "NEWS_GETTING",
                    },
                    {
                        title: "သတင်းပေးရန်",
                        payload: "NEWS_REPORTING",
                    },
                ]),
            ];
        }
        else {
            response = {
                text: "This is a default postback message for payload: " + payload + "!",
            };
        }
        return response;
    };
    Receive.prototype.handlePrivateReply = function (type, object_id) {
        var _a;
        var welcomeMessage = "မင်္ဂလာပါ။ ဘာများကူညီပေးရမလဲခင်ဗျ။";
        var response = Response_1.default.genQuickReply(welcomeMessage, [
            {
                title: "သတင်းယူရန်",
                payload: "NEWS_GETTING",
            },
            {
                title: "သတင်းပေးရန်",
                payload: "NEWS_REPORTING",
            },
        ]);
        var requestBody = {
            recipient: (_a = {},
                _a[type] = object_id,
                _a),
            message: response,
        };
        GraphAPI_1.default.callSendAPI(requestBody);
    };
    Receive.prototype.sendMessage = function (response, delay) {
        if (delay === void 0) { delay = 0; }
        if ("delay" in response) {
            delay = response["delay"];
            delete response["delay"];
        }
        var requestBody = {
            recipient: {
                id: this.user.psid,
            },
            message: response,
            persona_id: undefined,
        };
        if ("persona_id" in response) {
            var persona_id = response["persona_id"];
            delete response["persona_id"];
            requestBody = {
                recipient: {
                    id: this.user.psid,
                },
                message: response,
                persona_id: persona_id,
            };
        }
        setTimeout(function () { return GraphAPI_1.default.callSendAPI(requestBody); }, delay);
    };
    Receive.prototype.firstEntity = function (nlp, name) {
        return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
    };
    return Receive;
}());
exports.default = Receive;
