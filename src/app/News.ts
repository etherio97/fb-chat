import axios from "axios";
import DB from "./DB";
import Response from "./Response";
import User from "./User";

let updated_at;

export default class News {
  constructor(public user: User | null, public webhookEvent = null) {}

  update() {
    return this.updateHeadlines().then((headlines) =>
      this.updateArticles().then((articles) => {
        updated_at = Date.now();
        articles.forEach((article) => {
          let headline = headlines.find(
            (headline) => headline["title"] == article.title
          );
          if (headline) {
            article.datetime = headline["datetime"];
            article.timestamp = headline["timestamp"];
          } else {
            article.datetime = new Date();
            article.timestamp = Date.now();
          }
        });
        return articles;
      })
    );
  }

  updateHeadlines() {
    return axios
      .get("https://api.nweoo.com/news/headlines")
      .then(({ data }) => Object.values(data));
  }

  updateArticles() {
    return axios.get("https://api.nweoo.com/articles").then(({ data }) => data);
  }

  fetchAll() {
    let diff = Date.now() - updated_at;
    return new Promise((resolve, reject) => {
      if (diff < 3000000) {
        resolve(DB.read()["articles"]);
      } else {
        this.update()
          .then((articles) => {
            let db = DB.read();
            db.articles = articles;
            DB.save(db);
            resolve(articles);
          })
          .catch((e) => reject(e));
      }
    });
  }

  handleNews() {
    this.fetchAll();
    let response;
    let user = this.user;
    let read = user.headlines;
    let articles = DB.read()["articles"] || [];
    articles = articles.filter((article) => !read.includes(article.id));
    if (articles.length) {
      let article = articles[0];
      response = [];
      if (article.image) {
        response.push(
          Response.genImageTemplate(article.image, `source - ${article.source}`)
        );
      }
      response.push(
        Response.genQuickReply(article.title, [
          {
            title: "အပြည့်အစုံ",
            payload: "NEWS_FULL_ARTICLE",
          },
          {
            title: "နောက်ထပ်",
            payload: "NEWS_ANOTHER",
          },
        ])
      );
      read.push(article.id);
    } else {
      response = Response.genText("သတင်းများနောက်ထပ်မရှိပါ။");
    }

    return response;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "NEWS_ANOTHER":
        response = this.handleNews();
        break;

      case "NEWS_FULL_ARTICLE":
        let user = this.user;
        let headlines = user.headlines;
        let last = headlines[headlines.length - 1];
        let article = DB.read()["articles"].find(
          (article) => article.id == last
        );
        let content = article.content.replace(/\n\n\n\n/gim, "\n");
        response = [
          Response.genText(
            content.length > 500 ? content.slice(0, 490) + "..." : content
          ),
          Response.genQuickReply(
            "read more at: https://facebook.com/" + article.post_id,
            [{ title: "နောက်တစ်ပုဒ်", payload: "NEWS_ANOTHER" }]
          ),
          Response.genButtonTemplate(
            content.length > 500 ? content.slice(0, 490) + "..." : content,
            [
              Response.genWebUrlButton(
                "အပြည့်အစုံ",
                "https://facebook.com/" + article.post_id
              ),
            ]
          ),
        ];
        break;

      case "NEWS_GETTING":
        response = [
          Response.genQuickReply("ဘယ်လိုသတင်းများကိုရယူလိုပါသလဲ။", [
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
          Response.genQuickReply("ဘယ်လိုသတင်းပေးလိုပါသလဲ။", [
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
          Response.genQuickReply(
            "တယ်လီနောအသုံးပြုသူများအနေနဲ့ 09758035929 ကို news (သို့) သတင်း လို့ SMS ပေးပို့ပြီး သတင်းခေါင်းစဉ်များကိုရယူနိုင်ပါတယ်။",
            [{ title: "Messenger", payload: "NEWS_GETTING_MESSENGER" }]
          ),
        ];
        break;

      case "NEWS_GETTING_MESSENGER":
        response = [
          Response.genQuickReply(
            "ဒီကနေ news (သို့) သတင်း လို့ပို့ပြီး သတင်းများကိုရယူနိုင်ပါတယ်။",
            [
              { title: "SMS", payload: "NEWS_GETTING_SMS" },
              { title: "သတင်း", payload: "NEWS_ANOTHER" },
            ]
          ),
        ];
        break;

      case "NEWS_REPORTING_SMS":
        response = [
          Response.genText(
            "ဖုန်းနံပါတ် 09758035929 ကို #nweoo ထည့်ပြီး သတင်းအချက်အလက်တွေကို SMS နဲ့ပေးပို့လိုက်တာနဲ့ အမြန်ဆုံးကျွန်တော်တို့ Page ပေါ်တင်ပေးသွားမှာဖြစ်ပါတယ်။"
          ),
        ];
        break;

      case "NEWS_REPORTING_MESSENGER":
        response = [
          Response.genText(
            "ဒီကနေ #nweoo ထည့်ပြီး သတင်းအချက်အလက်တွေကို ပို့လိုက်တာနဲ့ ချက်ချင်းကျွန်တော်တို့ရဲ့ Page ပေါ်တင်ပေးသွားမှာဖြစ်ပါတယ်။"
          ),
        ];
        break;
    }

    return response;
  }
}
