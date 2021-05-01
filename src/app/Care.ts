import Response from "./Response";
import User from "./User";

export default class Care {
  constructor(public user?: User, public webhookEvent?: any) {}

  handlePayload(payload: string) {
    switch (payload) {
      case "CARE_AGENT_START":
        return this.talkToAgent();

      case "CARE_AGENT_STOP":
        return this.stopAgent();
    }

    return [];
  }

  talkToAgent() {
    this.user.talk_to_agent = Date.now();
    return Response.genButtonTemplate(
      "အေဂျင့်နှင့်ဆက်သွယ်ပေးနေပါတယ်ခင်ဗျာ။ အောက်ကခလုတ်ကိုနှိပ်ပြီး ဒီဆက်သွယ်မှုကိုရပ်တန့်နိုင်ပါတယ်။",
      [Response.genPostbackButton("ရပ်တန့်ရန်", "CARE_AGENT_STOP")]
    );
  }

  stopAgent() {
    this.user.talk_to_agent = undefined;
    return [Response.genText("အေးဂျင့်နှင့်ဆက်သွယ်မှုကို ရပ်တန့်လိုက်ပါပြီ။")];
  }
}
