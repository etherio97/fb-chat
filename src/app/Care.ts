import User from "./User";
import Response from "./Response";

export default class Care {
  constructor(public user?: User, public webhookEvent?: any) {}

  handleMessage() {
    let user = this.user;
    let event = this.webhookEvent;
    if (event.postback) {
      return this.handlePayload(this.webhookEvent.postback.payload);
    }
    if (user.mode === "agent") {
      return [];
    }
    return [];
  }

  handlePayload(payload: string): Array<object> {
    switch (payload) {
      case "CARE_HELP":
        return this.defaultFallback();
      case "CARE_AGENT_START":
        return this.talkToAgent();
      case "CARE_AGENT_STOP":
        return this.stopAgent();
    }
    return [];
  }

  defaultFallback() {
    if (this.user.mode === "agent") {
      return [];
    }
    this.clearSession();
    return [
      Response.genQuickReply("ဘာများကူညီပေးရမလဲခင်ဗျ။", [
        {
          title: "သတင်းပေး",
          payload: "NEWS_REPORTING",
        },
        {
          title: "သတင်းယူ",
          payload: "NEWS_GETTING",
        },
      ]),
    ];
  }

  talkToAgent() {
    if (this.user.mode === "agent") {
      return [];
    }
    this.user.mode = "agent";
    this.user.talk_to_agent = Date.now();
    return [
      Response.genButtonTemplate(
        "အေဂျင့်နှင့် ဆက်သွယ်ပေးနေပါတယ်။ အမြန်ဆုံးပြန်လည်ဆက်သွယ်ပေးပါ့မယ်။",
        [Response.genPostbackButton("ရပ်တန့်ရန်", "CARE_AGENT_STOP")]
      ),
    ];
  }

  stopAgent() {
    let greeting = Response.genText("မင်္ဂလာရှိသောနေ့ရက်ဖြစ်ပါစေခင်ဗျာ။");
    let feedback = Response.genQuickReply(
      "အခုဆက်သွယ်မေးမြန်းတဲ့အပေါ် အဆင်ပြေလာဆိုတာ အဆင့်သတ်မှတ်ပေးပါဦးဗျာ။",
      [
        {
          title: "😀",
          payload: "CARE_RATING_GOOD",
        },
        {
          title: "😐",
          payload: "CARE_RATING_NULL",
        },
        {
          title: "🙁",
          payload: "CARE_RATING_BAD",
        },
      ]
    );
    feedback["delay"] = 3000;
    this.user.mode = "default";
    this.user.talk_to_agent = undefined;
    return [greeting, feedback];
  }

  extendSession() {
    this.user.mode = "agent";
    this.user.talk_to_agent = Date.now(); //7200000
  }

  clearSession() {
    this.user.mode = "default";
    this.user.talk_to_agent = undefined;
  }
}
