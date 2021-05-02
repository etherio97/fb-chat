import GraphAPI from "./GraphAPI";
import Receive from "./Receive";
import Response from "./Response";
import User from "./User";

export default class Care {
  constructor(public user?: User, public webhookEvent?: any) {}

  handlePayload(payload: string) {
    switch (payload) {
      case "CARE_HELP":
        return this.defaultFallback(this.webhookEvent.message?.text?.trim());

      case "CARE_AGENT_START":
        return this.talkToAgent();

      case "CARE_AGENT_STOP":
        return this.stopAgent();

      case "CARE_AGENT_REGISTER":
        return this.registerAgent();

      case "CARE_AGENT_NAME":
        return this.askName();

      case "CARE_AGENT_CANCEL":
        this.user.store["stage"] = null;
        return [];
    }

    return [];
  }

  defaultFallback(message: string | undefined | null) {
    console.log(this.user);
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

  askName() {
    this.user.store["class"] = "care";
    this.user.store["answer"] = "text";
    this.user.store["callback"] = "answerName";

    return Response.genText("အသစ်ပြုလုပ်မည့် အေဂျင့်နာမည်ကိုထည့်သွင်းပါ။");
  }

  answerName(name: string) {
    this.user.store["agent"] = {
      name,
      profile_pic: null,
    };
    return this.askProfilePic();
  }

  askProfilePic() {
    this.user.store["class"] = "care";
    this.user.store["answer"] = "attachment:image";
    this.user.store["callback"] = "sendImage";

    return Response.genText(
      "အေဂျင့်အကောင့်အတွက် အသုံးပြုလိုသည့် ပရိုဖိုင်ဓာတ်ပုံကို ပို့ပေးပါ။"
    );
  }

  sendImage(payload: object) {
    let recieve = new Receive(this.user, this.webhookEvent);
    recieve.sendAction(Response.genSenderAction("typing_on"), 100);
    GraphAPI.postPersonaAPI(
      this.user.store["agent"]["name"],
      payload["url"]
    ).then((id) => {
      this.user.store["agent"]["id"] = id;
      recieve.sendMessage(
        Response.genQuickReply(`သင့်အေဂျင့်အကောင့် ID မှာ ${id} ဖြစ်ပါတယ်။`, [])
      );
    });
    return [];
  }

  talkToAgent() {
    this.user.mode = "agent";
    this.user.talk_to_agent = Date.now();
    return Response.genButtonTemplate(
      "အေဂျင့်နှင့်ဆက်သွယ်ပေးနေပါတယ်ခင်ဗျာ။ အောက်ကခလုတ်ကိုနှိပ်ပြီး ဒီဆက်သွယ်မှုကိုရပ်တန့်နိုင်ပါတယ်။",
      [Response.genPostbackButton("ရပ်တန့်ရန်", "CARE_AGENT_STOP")]
    );
  }

  stopAgent() {
    this.user.mode = "default";
    this.user.talk_to_agent = undefined;
    /* Heroku Server Timezone (UTC) + GMT+6:30 (Myanmar) */
    let hour = new Date(Date.now() + 23400000).getHours();
    let text = "မင်္ဂလာရှိသောမနက်ခင်း ဖြစ်ပါစေခင်ဗျာ...";
    if (hour >= 10) {
      text = "မင်္ဂလာရှိသောနေ့ရက် ဖြစ်ပါစေခင်ဗျာ...";
    } else if (hour >= 14) {
      text = "သာယာသောနေ့ရက် ဖြစ်ပါစေခင်ဗျာ...";
    } else if (hour >= 18) {
      text = "သာယာသောညချမ်း ဖြစ်ပါစေခင်ဗျာ...";
    }
    return [
      Response.genText("အေးဂျင့်နှင့်ဆက်သွယ်မှုကို ရပ်တန့်လိုက်ပါပြီ။"),
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
