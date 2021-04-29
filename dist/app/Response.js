"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Response = (function () {
    function Response() {
    }
    Response.genQuickReply = function (text, quickReplies) {
        var response = {
            text: text,
            quick_replies: [],
        };
        for (var _i = 0, quickReplies_1 = quickReplies; _i < quickReplies_1.length; _i++) {
            var quickReply = quickReplies_1[_i];
            response["quick_replies"].push({
                content_type: "text",
                title: quickReply["title"],
                payload: quickReply["payload"],
            });
        }
        return response;
    };
    Response.genGenericTemplate = function (image_url, title, subtitle, buttons) {
        var response = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: title,
                            subtitle: subtitle,
                            image_url: image_url,
                            buttons: buttons,
                        },
                    ],
                },
            },
        };
        return response;
    };
    Response.genImageTemplate = function (image_url, title, subtitle) {
        if (subtitle === void 0) { subtitle = ""; }
        var response = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: title,
                            subtitle: subtitle,
                            image_url: image_url,
                        },
                    ],
                },
            },
        };
        return response;
    };
    Response.genButtonTemplate = function (title, buttons) {
        var response = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: title,
                    buttons: buttons,
                },
            },
        };
        return response;
    };
    Response.genText = function (text) {
        var response = {
            text: text,
        };
        return response;
    };
    Response.genTextWithPersona = function (text, persona_id) {
        var response = {
            text: text,
            persona_id: persona_id,
        };
        return response;
    };
    Response.genPostbackButton = function (title, payload) {
        var response = {
            type: "postback",
            title: title,
            payload: payload,
        };
        return response;
    };
    Response.genWebUrlButton = function (title, url) {
        var response = {
            type: "web_url",
            title: title,
            url: url,
            messenger_extensions: true,
        };
        return response;
    };
    Response.genNuxMessage = function (user) {
        var welcome = this.genText("\u1019\u1004\u103A\u1039\u1002\u101C\u102C\u1015\u102B " + user.name);
        var curation = this.genQuickReply("ဘာများကူညီပေးရမလဲဗျ။", [
            {
                title: "သတင်းယူရန်",
                payload: "NEWS_GETTING",
            },
            {
                title: "သတင်းပေး",
                payload: "NEWS_REPORTING",
            },
        ]);
        return [welcome, curation];
    };
    return Response;
}());
exports.default = Response;
