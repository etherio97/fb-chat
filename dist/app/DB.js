"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const DATABASE_PATH = (0, path_1.resolve)((0, path_1.dirname)(__dirname), ".db.json");
class DB {
    static init() {
        (0, fs_1.existsSync)(DATABASE_PATH) || this.save({ users: [], articles: [] });
    }
    static read() {
        return JSON.parse((0, fs_1.readFileSync)(DATABASE_PATH, "utf-8"));
    }
    static save(db) {
        (0, fs_1.writeFileSync)(DATABASE_PATH, JSON.stringify(db), "utf-8");
    }
}
exports.default = DB;
