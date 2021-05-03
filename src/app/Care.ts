import GraphAPI from "./GraphAPI";
import Receive from "./Receive";
import Response from "./Response";
import User from "./User";

const { APP_URL } = process.env;

export default class Care {
  constructor(public user?: User, public webhookEvent?: any) {}

  handleMessage() {
    let user = this.user;

    if (user.mode !== "agent") {
      return this.defaultFallback();
    }

    if (this.webhookEvent.postback?.payload) {
      return this.handlePayload(this.webhookEvent.postback.payload);
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
    this.clearSession();
    return [
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

  talkToAgent() {
    if (this.user.mode === "agent") {
      this.extendSession();
      return [];
    }
    this.extendSession();
    return [
      Response.genButtonTemplate(
        "အေဂျင့်နှင့်ဆက်သွယ်ပေးနေပါတယ်။ ဆက်သွယ်မှုကိုရပ်တန့်လိုပါက အောက်ကခလုတ်ကိုနှိပ်ပါ။",
        [
          Response.genWebUrlButton(
            "ရပ်တန့်ရန်",
            `${APP_URL}/stop/${this.user.psid}?expired=${this.user.talk_to_agent}`,
            "compact"
          ),
        ]
      ),
    ];
  }

  stopAgent() {
    let respnse = Response.genQuickReply(
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
    respnse["delay"] = 3000;
    this.clearSession();
    return [respnse];
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
