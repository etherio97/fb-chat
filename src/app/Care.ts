import GraphAPI from "./GraphAPI";
import Receive from "./Receive";
import Response from "./Response";
import User from "./User";

const { APP_URL } = process.env;

export default class Care {
  constructor(public user?: User, public webhookEvent?: any) {}

  handlePayload(payload: string): Array<object> {
    switch (payload) {
      case "CARE_HELP":
        return this.defaultFallback(this.webhookEvent.message?.text?.trim());

      case "CARE_AGENT_START":
        return this.talkToAgent();

      case "CARE_AGENT_STOP":
        return this.stopAgent();
    }

    return [];
  }

  defaultFallback(message?: string) {
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
    this.user.mode = "agent";
    this.user.talk_to_agent = Date.now();
    return [
      Response.genButtonTemplate(
        "အေဂျင့်နှင့်ဆက်သွယ်ပေးနေပါတယ်။ ဆက်သွယ်မှုကိုရပ်တန့်လိုပါက အောက်ကခလုတ်ကိုနှိပ်ပါ။",
        [
          Response.genWebUrlButton(
            "ရပ်တန့်ရန်",
            `${APP_URL}/stop/${this.user.psid}`,
            "compact"
          ),
        ]
      ),
    ];
  }

  stopAgent() {
    this.user.mode = "default";
    this.user.talk_to_agent = undefined;
    /* Heroku Server Timezone (UTC) + GMT+6:30 (Myanmar) */
    let hour = new Date(Date.now() + 23400000).getHours();
    let text: string;
    if (hour >= 4) {
      text = "မင်္ဂလာရှိသောမနက်ခင်းဖြစ်ပါစေခင်ဗျာ...";
    } else if (hour >= 9) {
      text = "မင်္ဂလာရှိသောနေ့ရက်ဖြစ်ပါစေခင်ဗျာ...";
    } else if (hour >= 14) {
      text = "သာယာသောညနေခင်းဖြစ်ပါစေခင်ဗျာ...";
    } else if (hour >= 18) {
      text = "သာယာသောညချမ်းအခါသမယဖြစ်ပါစေခင်ဗျာ...";
    }
    return [
      Response.genText("ဆက်သွယ်မှုကိုရပ်တန့်လိုက်ပါပြီ။"),
      Response.genQuickReply(text, [
        {
          title: "သတင်း",
          payload: "NEWS_ANOTHER",
        },
        {
          title: "အကူအညီ",
          payload: "CARE_HELP",
        },
      ]),
    ];
  }

  registerAgent() {
    return Response.genQuickReply(
      "အေ့ဂျင့်တစ်ယောက်အနေဖြင့်မှတ်ပုံတင်လိုပါသလား။",
      [
        { title: "ပယ်ဖျက်", payload: "CARE_AGENT_CANCEL" },
        { title: "အတည်ပြု", payload: "CARE_AGENT_NAME" },
      ]
    );
  }
}
