const fs = require("fs");
const path = require("path");
const DATABASE_PATH = path.resolve(path.dirname(__dirname), ".db.json");

module.exports = class DB {
  static init() {
    fs.existsSync(DATABASE_PATH) ||
      this.save({ users: [], headlines: [], articles: [] });
  }
  static read() {
    return JSON.parse(fs.readFileSync(DATABASE_PATH, "utf-8"));
  }
  static save(db) {
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(db), "utf-8");
  }
};
