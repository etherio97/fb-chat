const News = require("./news"),
  Response = require("./response"),
  GraphAPi = require("./graph-api");

module.exports = class Receive {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

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
        text: `နည်းပညာပိုင်းအရချို့ယွင်းမှုရှိနေပါတယ်။ \n\n---\n${error}`,
      };
    }

    console.log(responses);

    if (Array.isArray(responses)) {
      console.log(responses.length);
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

    if (
      (greeting && greeting.confidence > 0.8) ||
      message.match(/(?:hello|hi|ဟယ်လို|ဟိုင်း|မင်္ဂလာ|mingala)/g)
    ) {
      response = Response.genNuxMessage(this.user);
    } else if (message.match(/(?:news|သတင်း|သတငျး|ဘာထူးလဲ)/)) {
      let news = new News(this.user, this.webhookEvent);
      response = news.handleNews();
    } else {
      response = [
        Response.genQuickReply("ဘာများကူညီပေးရမလဲခင်ဗျ။", [
          {
            title: "သတင်းယူရန်",
            payload: "NEWS_GETTING",
          },
          {
            title: "သတင်းပေး",
            payload: "NEWS_REPORTING",
          },
        ]),
      ];
    }

    return response;
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
    GraphAPi.callFBAEventsAPI(this.user.psid, payload);
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
        Response.genText("မင်္ဂလာပါ။"),
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

    GraphAPi.callSendAPI(requestBody);
  }

  sendMessage(response, delay = 0) {
    // Check if there is delay in the response
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    // Construct the message body
    let requestBody = {
      recipient: {
        id: this.user.psid,
      },
      message: response,
    };

    // Check if there is persona id in the response
    if ("persona_id" in response) {
      let persona_id = response["persona_id"];
      delete response["persona_id"];

      requestBody = {
        recipient: {
          id: this.user.psid,
        },
        message: response,
        persona_id: persona_id,
      };
    }

    setTimeout(() => GraphAPi.callSendAPI(requestBody), delay);
  }

  firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
  }
};
