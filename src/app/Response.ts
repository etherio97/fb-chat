import User from "./User";

type SenderAction = "typing_on" | "typing_off" | "mark_seen";

interface QuickReply {
  content_type?: "text" | "user_phone_number" | "user_email";
  title: string;
  payload: string;
}

interface Button {
  type?: "web_url" | "postback" | "phone_number";
  webview_height_ratio?: "compact" | "tall" | "full";
  title: string;
  url?: string;
  payload?: string;
  image_url?: string;
  messenger_extensions?: Boolean;
}

interface GenericTemplate {
  image_url: string;
  title: string;
  subtitle: string;
  default_action?: Button;
  buttons: Button[];
}

interface ImageTemplate {
  image_url: string;
  title: string;
  subtitle: string;
}

export default class Response {
  static genTypingAction() {
    return [
      this.genSenderAction("typing_on"),
      this.genSenderAction("typing_off"),
    ];
  }

  static genSenderAction(sender_action: SenderAction) {
    return { sender_action };
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

  static genGenericTemplate(elements: GenericTemplate[]) {
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements,
        },
      },
    };
  }

  static GenericTemplate(
    image_url: string,
    title: string,
    subtitle: string,
    buttons: Button[],
    default_action?: Button
  ): GenericTemplate {
    return {
      title,
      image_url,
      subtitle,
      buttons,
      default_action,
    };
  }

  static genImageTemplate(elements: ImageTemplate[]) {
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements,
        },
      },
    };
  }

  static ImageTemplate(
    image_url: string,
    title: string,
    subtitle?: string
  ): ImageTemplate {
    return {
      image_url,
      title,
      subtitle: subtitle || "",
    };
  }

  static genButtonTemplate(title: string, buttons: Button[]) {
    return {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons,
        },
      },
    };
  }

  static genText(text: string) {
    return { text };
  }

  static genTextWithPersona(text: string, persona_id: string) {
    return {
      text,
      persona_id,
    };
  }

  static genPostbackButton(title: string, payload: string): Button {
    return {
      type: "postback",
      title,
      payload,
    };
  }

  static genWebUrlButton(title: string, url: string): Button {
    return {
      type: "web_url",
      title: title,
      url: url,
      messenger_extensions: true,
    };
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
