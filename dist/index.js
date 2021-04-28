"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var DB_1 = __importDefault(require("./app/DB"));
var express_1 = __importStar(require("express"));
var verify_1 = __importDefault(require("./functions/verify"));
var routes_1 = __importDefault(require("./routes"));
dotenv_1.config();
var app = express_1.default();
var PORT = process.env.PORT;
DB_1.default.init();
app.use(express_1.json({ verify: verify_1.default }));
app.use(express_1.urlencoded({ extended: true }));
app.use(routes_1.default);
app.listen(PORT || 3000, function () {
    return console.log("server is running on http://localhost:%s", PORT || 3000);
});
