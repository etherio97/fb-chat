"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DB_1 = __importDefault(require("./DB"));
var _a = process.env, APP_ID = _a.APP_ID, PAGE_ID = _a.PAGE_ID;
var ArticleHTML = (function () {
    function ArticleHTML(image, title, source, link, content) {
        this.image = image;
        this.title = title;
        this.source = source;
        this.link = link;
        this.content = content;
    }
    ArticleHTML.find = function (id) {
        var article = DB_1.default.read()["articles"].find(function (article) { return article.id == id; });
        if (!article)
            return null;
        return new ArticleHTML(article.image, article.title, article.source, article.link, article.content);
    };
    return ArticleHTML;
}());
exports.default = ArticleHTML;
