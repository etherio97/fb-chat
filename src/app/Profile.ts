import GraphAPI from "./GraphAPI";
import User from "./User";

const { APP_URL, SHOP_URL } = process.env;

export default class Profile {
  constructor(public user: User | null) {}

  setWebhook() {
    GraphAPI.callSubscriptionsAPI("");
    GraphAPI.callSubscribedApps("");
  }

  setPageFeedWebhook() {
    GraphAPI.callSubscriptionsAPI("feed");
    GraphAPI.callSubscribedApps("feed");
  }

  setThread() {
    let profilePayload = {
      ...this.getGetStarted(),
      ...this.getGreeting(),
      ...this.getPersistentMenu(),
    };

    GraphAPI.callMessengerProfileAPI(profilePayload);
  }

  setGetStarted() {
    let getStartedPayload = this.getGetStarted();
    GraphAPI.callMessengerProfileAPI(getStartedPayload);
  }

  setGreeting() {
    let greetingPayload = this.getGreeting();
    GraphAPI.callMessengerProfileAPI(greetingPayload);
  }

  setPersistentMenu() {
    let menuPayload = this.getPersistentMenu();
    GraphAPI.callMessengerProfileAPI(menuPayload);
  }

  setWhitelistedDomains() {
    let domainPayload = this.getWhitelistedDomains();
    GraphAPI.callMessengerProfileAPI(domainPayload);
  }

  getGetStarted() {
    return {
      get_started: {
        payload: "GET_STARTED",
      },
    };
  }

  getGreeting() {
    let greetings = [this.getGreetingText()];
    return {
      greeting: greetings,
    };
  }

  getPersistentMenu() {
    let menuItems = [this.getMenuItems()];
    return {
      persistent_menu: menuItems,
    };
  }

  getGreetingText() {
    return {
      locale: "default",
      text: "မင်္ဂလာပါ",
    };
  }

  getMenuItems() {
    return {
      locale: "default",
      composer_input_disabled: false,
      call_to_actions: [
        {
          type: "postback",
          title: "သတင်းရယူရန်",
          payload: "NEWS_GETTING",
        },
        {
          type: "postback",
          title: "သတင်းပေးပို့ရန်",
          payload: "NEWS_REPORTING",
        },
        {
          type: "web_url",
          title: "Website",
          url: SHOP_URL,
          webview_height_ratio: "full",
        },
      ],
    };
  }

  getWhitelistedDomains() {
    return {
      whitelisted_domains: [
        APP_URL,
        SHOP_URL,
        "https://facebook.com",
        "https://m.facebook.com",
        "https://www.facebook.com",
        "https://web.facebook.com",
      ],
    };
  }
}
