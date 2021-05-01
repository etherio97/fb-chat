import axios from "axios";
import DB from "./DB";
import GraphAPI from "./GraphAPI";
import Receive from "./Receive";
import Report from "./Report";
import Response from "./Response";
import User from "./User";

const { APP_URL } = process.env;

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

    let response,
      remain,
      max = 5,
      user = this.user,
      read = user.headlines,
      articles = DB.read()["articles"] || [],
      templates = [];

    articles = articles.filter((article) => !read.includes(article.id));
    remain = articles.length - max;
    articles = articles.slice(0, max);

    for (let article of articles) {
      let [__page, __post] = article.post_id.split("_");
      let url = `https://facebook.com/${__page}/posts/${__post}`;
      let template = Response.GenericTemplate(
        article.image,
        article.title,
        article.source,
        [],
        Response.genWebUrlButton("အပြည့်အစုံဖတ်ရန်", url)
      );
      read.push(article.id);
      templates.push(template);
    }
    if (templates.length) {
      response = [Response.genGenericTemplate(templates)];
      remain > 0 &&
        response.push(
          Response.genQuickReply("နောက်ထပ်သတင်းများရယူလိုပါသလား။", [
            { title: "သတင်း", payload: "NEWS_ANOTHER" },
          ])
        );
    } else {
      response = Response.genText("သတင်းများနောက်ထပ်မရှိပါ။");
    }

    return response;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "NEWS_REPORT_DELETE":
        response = this.handleDelete();
        break;

      case "NEWS_ANOTHER":
        response = this.handleNews();
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

  handleDelete() {
    let response = [];
    let message = this.webhookEvent.message?.text || "";
    if (message != "" && this.user.mode === "delete") {
      let receive = new Receive(this.user, this.webhookEvent);
      this.user.mode = null;
      this.user.reports = this.user.reports.filter((id) => id != message);
      Report.remove(message, this.user.psid)
        .then(() => {
          let response = Response.genQuickReply(
            "ပေးပို့ချက် ID #" + message + " ကို ဖျက်လိုက်ပါပြီးခင်ဗျ...",
            [
              {
                title: "ပြန်လည်စတင်ရန်",
                payload: "GET_STARTED",
              },
            ]
          );
          receive.sendMessage(response);
        })
        .catch((e) => {
          let response = Response.genButtonTemplate(
            "လုပ်ဆောင်ချက်မအောင်မြင်ပါ။ အောက်ဖော်ပြပါလင့်ခ်ကဝင်ပြီး ဖျက်ပေးပါခင်ဗျာ...",
            [
              Response.genWebUrlButton(
                "ဝင်ရောက်ရန်",
                `https://www.nweoo.com/report/${message}?phone=${this.user.psid}`
              ),
            ]
          );
          receive.sendMessage(response, 1400);
        })
        .finally(() => receive.sendAction("typing_off", 1200));
      receive.sendAction("typing_on", 200);
    } else {
      if (this.user.reports.length) {
        response = [
          Response.genQuickReply("ဖျက်လိုတဲ့ ပေးပို့ချက် ID ကို ထည့်သွင်းပါ။", [
            ...this.user.reports.map((id) => ({
              title: id,
              payload: "NEWS_REPORT_DELETE",
            })),
          ]),
        ];
      } else {
        response = [Response.genText("ဖျက်လိုတဲ့ ပေးပို့ချက် ID ထည့်သွင်းပါ။")];
      }
      this.user.mode = "delete";
    }
    return response;
  }
}
