import DB from "./DB";
import { dirname, join } from "path";
import ejs from "ejs";

const { APP_ID, PAGE_ID } = process.env;

export default class ArticleHTML {
  constructor(
    public image,
    public title,
    public source,
    public link,
    public content
  ) {}

  static find(id: string) {
    let article = DB.read()["articles"].find((article) => article.id == id);
    if (!article) return null;
    return new ArticleHTML(
      article.image,
      article.title,
      article.source,
      article.link,
      article.content
    );
  }
}
