import User from "./User";
import Response from "./Response";
import GraphAPI from "./GraphAPI";
import Profile from "./Profile";

export default class Care {
  constructor(public user: User, public webhookEvent?: any) {}

  handle() {
    if (this.webhookEvent.postback) {
      return this.handlePayload(this.webhookEvent.postback.payload);
    }
    if (typeof this.user.talk_to_agent === "number") {
      this.user.talk_to_agent++;
    }
    return [];
  }

  handlePayload(payload: string): Array<object> {
    switch (payload) {
      case "CARE_HELP":
        return this.defaultFallback();
      case "CARE_OTHER":
      case "CARE_AGENT_START":
        return this.talkToAgent();
      case "CARE_AGENT_STOP":
        return this.stopAgent();
      case "CARE_RATING_GOOD":
      case "CARE_RATING_NULL":
        return [
          Response.genText(
            "အခုလိုဖြေကြားပေးတဲ့အတွက် ကျေးဇူးထူးတင်ရှိပါတယ်ခင်ဗျာ။"
          ),
        ];
      case "CARE_RATING_BAD":
        this.user.mode = "suggestion";
        return [
          Response.genText(
            "အဆင်မပြေတဲ့အတွက်စိတ်မကောင်းပါဘူးဗျာ။ ဘာများလိုအပ်လဲဆိုတာပြောပေးပါအုံးဗျာ..."
          ),
        ];
    }

    this.user.talk_to_agent++;

    return [];
  }

  handleSuggestion() {
    if (this.webhookEvent.postback) {
      return this.handle();
    }

    this.clearSession();

    return [Response.genText("")];
  }

  defaultFallback() {
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
        {
          title: "အခြား",
          payload: "CARE_OTHER",
        },
      ]),
    ];
  }

  talkToAgent() {
    if (this.user.mode === "agent") {
      return [];
    }

    this.user.mode = "agent";
    this.user.talk_to_agent = 0;

    GraphAPI.callCustomUserSettings(this.user.psid, {
      locale: "default",
      composer_input_disabled: false,
      call_to_actions: [
        {
          type: "postback",
          title: "ရပ်တန့်ရန်",
          payload: "CARE_AGENT_STOP",
        },
      ],
    });

    return [
      Response.genButtonTemplate(
        "သက်ဆိုင်ရာနဲ့ အမြန်ဆုံးပြန်လည်ဆက်သွယ်ပေးပါ့မယ်ခင်ဗျာ။ ရပ်တန့်လိုပါက stop ဟုပို့၍ရပ်တန့်နိုင်ပါတယ်။",
        [Response.genPostbackButton("ရပ်တန့်ရန်", "CARE_AGENT_STOP")]
      ),
    ];
  }

  stopAgent() {
    let response = [];

    GraphAPI.callCustomUserSettings(
      this.user.psid,
      new Profile(null).getMenuItems()
    );

    response.push(Response.genText("မင်္ဂလာရှိသောနေ့ရက်ဖြစ်ပါစေခင်ဗျာ။"));

    if (this.user.talk_to_agent > 2) {
      let feedback = Response.genQuickReply(
        "အခုဆက်သွယ်မေးမြန်းတဲ့အပေါ် အဆင့်သတ်မှတ်ပေးပါဦးဗျ။",
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

      response.push(feedback);
    }

    this.user.mode = "default";
    this.user.talk_to_agent = undefined;

    return [];
  }

  extendSession() {
    this.user.mode = "agent";
    this.user.talk_to_agent = 0; //7200000
  }

  clearSession() {
    this.user.mode = "default";
    this.user.talk_to_agent = undefined;
  }
}
