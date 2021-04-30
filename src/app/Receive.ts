import Response from "./Response";
import News from "./News";
import GraphAPI from "./GraphAPI";
import User from "./User";
import Report from "./Report";

const { PAGE_ID } = process.env;

export default class Receive {
  constructor(public user: User | null, public webhookEvent = null) {}

  handleMessage() {
    let responses;
    let event = this.webhookEvent;

    try {
      if (event.message) {
        let message = event.message;
        if (message.quick_reply) {
          responses = this.handleQuickReply();
        } else if (message.attachments) {
          responses = this.handleAttachmentMessage();
        } else if (message.text) {
          responses = this.handleTextMessage();
        }
      } else if (event.postback) {
        responses = this.handlePostback();
      } else if (event.referral) {
        responses = this.handleReferral();
      }
    } catch (error) {
      responses = {
        text: `နည်းပညာပိုင်းအရချို့ယွင်းနေပါတယ်။ \n\n---\n${error}`,
      };
      console.log(error);
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  // Handles messages events with text
  handleTextMessage() {
    let greeting = this.firstEntity(this.webhookEvent.message.nlp, "greetings");
    let message = this.webhookEvent.message.text.trim().toLowerCase();
    let response;

    if (this.user.mode === "delete") {
      response = new News(this.user, this.webhookEvent).handlePayload(
        "NEWS_REPORT_DELETE"
      );
    } else if (message.match(/(?:news|သတင်း|သတငျး|ဘာထူးလဲ)/)) {
      let news = new News(this.user, this.webhookEvent);
      response = news.handleNews();
    } else if (message.match(/#n[we]{2}oo/gim)) {
      if (
        !this.user.last_report ||
        Date.now() - this.user.last_report > 300000
      ) {
        this.user.last_report = new Date().getTime();
        Report.send(this.user.psid, message).then(({ id, post_id }) => {
          this.user.reports.push(id);
          this.sendMessage(
            Response.genButtonTemplate(
              `သင့်ပေးပို့ချက် ID မှာ ${id} ဖြစ်ပါတယ်။`,
              [
                Response.genWebUrlButton(
                  "ကြည့်ရှုရန်",
                  `https://m.facebook.com/story.php?src=${PAGE_ID}&story_fbid=${post_id}&refsrc=https%3A%2F%2Fm.me%2FNweOo22222%3Fmode%3Dbot`
                ),
                Response.genPostbackButton("ပြန်ဖျက်ရန်", "NEWS_REPORT_DELETE"),
              ]
            )
          );
        });
        response = Response.genText(
          "အခုလိုသတင်းပေးပို့တဲ့အတွက်ကျေးဇူးတင်ပါတယ်။"
        );
      } else {
        response = Response.genText(
          "၅ မိနစ်လောက်ခြားပြီးမှပြန်ပို့ပေးပါခင်ဗျာ။ အခုလိုဆက်သွယ်ပေးပို့တဲ့အတွက်ကျေးဇူးတင်ပါတယ်။"
        );
      }
    } else if (
      (greeting && greeting.confidence > 0.8) ||
      message.match(/(?:hello|hi|ဟယ်လို|ဟိုင်း|မင်္ဂလာ|mingala)/g)
    ) {
      response = Response.genNuxMessage(this.user);
    } else {
      response = [
        Response.genQuickReply("ဘာများကူညီပေးရမလဲခင်ဗျ။", [
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

    return response || [];
  }

  // Handles mesage events with attachments
  handleAttachmentMessage() {
    let response;
    let attachment = this.webhookEvent.message.attachments[0];

    response = Response.genQuickReply(
      "အခုလိုဆက်သွယ်တဲ့အတွက် ကျေးဇူးတင်ရှိပါတယ်ခင်ဗျာ...",
      [
        {
          title: "ပြန်လည်စတင်ရန်",
          payload: "GET_STARTED",
        },
      ]
    );

    return response;
  }

  handleQuickReply() {
    let payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  handlePostback() {
    let payload;
    let postback = this.webhookEvent.postback;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      payload = postback.payload;
    }
    return this.handlePayload(payload.toUpperCase());
  }

  handleReferral() {
    let payload = this.webhookEvent.referral.ref.toUpperCase();
    return this.handlePayload(payload);
  }

  handlePayload(payload) {
    GraphAPI.callFBAEventsAPI(this.user.psid, payload);
    let response;
    if (
      payload === "GET_STARTED" ||
      payload === "DEVDOCS" ||
      payload === "GITHUB"
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (payload.includes("NEWS")) {
      let news = new News(this.user, this.webhookEvent);
      response = news.handlePayload(payload);
    } else if (payload.includes("CHAT-PLUGIN")) {
      response = [
        Response.genText("မင်္ဂလာပါ " + this.user.name),
        Response.genQuickReply("ဘာများကူညီပေးရမလဲခင်ဗျ။", [
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
    } else {
      response = {
        text: `This is a default postback message for payload: ${payload}!`,
      };
    }
    return response;
  }

  handlePrivateReply(type, object_id) {
    let welcomeMessage = "မင်္ဂလာပါ။ ဘာများကူညီပေးရမလဲခင်ဗျ။";

    let response = Response.genQuickReply(welcomeMessage, [
      {
        title: "သတင်းယူရန်",
        payload: "NEWS_GETTING",
      },
      {
        title: "သတင်းပေးရန်",
        payload: "NEWS_REPORTING",
      },
    ]);

    let requestBody = {
      recipient: {
        [type]: object_id,
      },
      message: response,
    };

    GraphAPI.callSendAPI(requestBody);
  }

  sendMessage(response, delay = 0) {
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    let requestBody = {
      recipient: {
        id: this.user.psid,
      },
      message: response,
      persona_id: undefined,
    };

    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid,
        },
        message: response,
        persona_id,
      };
    }

    setTimeout(() => GraphAPI.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
}
