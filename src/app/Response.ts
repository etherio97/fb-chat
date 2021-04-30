import User from "./User";

type SenderAction = "typing_on" | "typing_off" | "mark_seen";

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

  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: [],
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"],
      });
    }

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons,
            },
          ],
        },
      },
    };

    return response;
  }

  static genImageTemplate(image_url, title, subtitle = "") {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
            },
          ],
        },
      },
    };

    return response;
  }

  static genButtonTemplate(title, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: title,
          buttons: buttons,
        },
      },
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text,
    };

    return response;
  }

  static genTextWithPersona(text, persona_id) {
    let response = {
      text: text,
      persona_id: persona_id,
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload,
    };

    return response;
  }

  static genWebUrlButton(title, url) {
    let response = {
      type: "web_url",
      title: title,
      url: url,
      messenger_extensions: true,
    };

    return response;
  }

  static genNuxMessage(user: User) {
    let welcome = this.genText(`မင်္ဂလာပါ ${user.name}`);
    let curation = this.genQuickReply("ဘာများကူညီပေးရမလဲဗျ။", [
      {
        title: "သတင်းယူရန်",
        payload: "NEWS_GETTING",
      },
      {
        title: "သတင်းပေး",
        payload: "NEWS_REPORTING",
      },
    ]);

    return [welcome, curation];
  }
}
