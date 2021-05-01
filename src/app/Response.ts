import User from "./User";

type SenderAction = "typing_on" | "typing_off" | "mark_seen";

interface QuickReply {
  content_type?: "text" | "user_phone_number" | "user_email";
  title?: string;
  payload?: string;
}

interface Button {
  content_type?: "web_url" | "postback" | "phone_number";
  title?: string;
  subtitle?: string;
  image_url?: string;
}

export default class Response {
  static genTypingAction() {
    return [
      this.genSenderAction("typing_on"),
      this.genSenderAction("typing_off"),
    ];
  }

  static genSenderAction(sender_action: SenderAction) {
    let response = {
      sender_action,
    };
    return response;
  }

  static genQuickReply(text: string, quickReplies: QuickReply[]) {
    let response = {
      text: text,
      quick_replies: [],
    };

    for (let reply of quickReplies) {
      response.quick_replies.push({
        content_type: reply.content_type || "text",
        title: reply.title,
        payload: reply.payload,
      });
    }

    return response;
  }

  static genGenericTemplate(
    image_url: string,
    title: string,
    subtitle: string,
    buttons: Button[]
  ) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title,
              image_url,
              subtitle,
              buttons,
            },
          ],
        },
      },
    };

    return response;
  }

  static genImageTemplate(image_url: string, title: string, subtitle?: string) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title,
              image_url,
              subtitle: subtitle || "",
            },
          ],
        },
      },
    };

    return response;
  }

  static genButtonTemplate(title: string, buttons: Button[]) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons,
        },
      },
    };

    return response;
  }

  static genText(text: string) {
    let response = {
      text,
    };

    return response;
  }

  static genTextWithPersona(text: string, persona_id: string) {
    let response = {
      text,
      persona_id,
    };

    return response;
  }

  static genPostbackButton(title: string, payload: string) {
    let response = {
      type: "postback",
      title,
      payload,
    };

    return response;
  }

  static genWebUrlButton(title: string, url: string) {
    let response = {
      type: "web_url",
      title: title,
      url: url,
      messenger_extensions: true,
    };

    return response;
  }

  static genNuxMessage(user: User) {
    let welcome = this.genText(`မင်္ဂလာပါ။`);
    let curation = this.genQuickReply("ဘာများကူညီပေးရမလဲခင်ဗျာ။", [
      {
        title: "သတင်းပေး",
        payload: "NEWS_REPORTING",
      },
      {
        title: "သတင်းယူ",
        payload: "NEWS_GETTING",
      },
    ]);

    return [welcome, curation];
  }
}
