let updated_at = 0;
const DEFAULT_IMAGE = "https://www.nweoo.com/images/cover.jpg";
const { default: axios } = require("axios");
const Response = require("./response"),
  DB = require("./db"),
  i18n = require("../i18n.config");

module.exports = class News {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  update() {
    return this.updateHeadlines().then((headlines) =>
      this.updateArticles().then((articles) => {
        updated_at = Date.now();
        articles.forEach((article) => {
          let headline = headlines.find(
            (headline) => headline.title == article.title
          );
          if (headline) {
            article.datetime = headline.datetime;
            article.timestamp = headline.timestamp;
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
      .then(({ data }) => data);
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
    let response = [];
    let user = this.user;
    let event = this.webhookEvent;
    let sent = user.headlines || [];
    let articles = DB.read()["articles"] || [];
    articles = articles
      .filter((article) => !sent.includes(article.id))
      .slice(0, 5);
    let i = 0;
    articles.forEach((article) => {
      i++;
      let r = Response.genGenericTemplate(
        article.image || DEFAULT_IMAGE,
        article.title + " -" + article.source,
        article.content.slice(0, 124),
        [
          Response.genPostbackButton(
            "အပြည်အစုံဖတ်ရန်",
            "NEWS_READ " + article.id
          ),
          Response.genWebUrlButton("External Link", article.link),
        ]
      );
      r.delay = 1200 * i;
      response.push(r);
    });
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "NEWS_GETTING":
        response = [
          Response.genQuickReply(
            i18n.__("news.channels", [
              {
                title: "SMS",
                payload: "NEWS_GETTING_SMS",
              },
              {
                title: "Messenger",
                payload: "NEWS_GETTING_MESSENGER",
              },
            ])
          ),
        ];
        break;

      case "NEWS_REPORTING":
        response = [
          Response.genQuickReply(i18n.__("news.channels"), [
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
        response = [Response.genText(i18n.__("news.getting_sms"))];
        break;

      case "NEWS_GETTING_MESSENGER":
        response = [Response.genText(i18n.__("news.getting_messenger"))];
        break;

      case "NEWS_REPORTING_SMS":
        response = [Response.genText(i18n.__("news.reporting_sms"))];
        break;

      case "NEWS_REPORTING_MESSENGER":
        response = [Response.genText(i18n.__("news.reporting_messenger"))];
        break;
    }

    return response;
  }
};
