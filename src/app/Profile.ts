import GraphAPI from "./GraphAPI";
import User from "./User";

const { APP_URL, SHOP_URL } = process.env;

export default class Profile {
  constructor(public user: User | null) {}

  setWebhook() {
    return GraphAPI.callSubscriptionsAPI("").then(() =>
      GraphAPI.callSubscribedApps("")
    );
  }

  setPageFeedWebhook() {
    return GraphAPI.callSubscriptionsAPI("feed").then(() =>
      GraphAPI.callSubscribedApps("feed")
    );
  }

  setThread() {
    let profilePayload = {
      ...this.getGetStarted(),
      ...this.getGreeting(),
      ...this.getPersistentMenu(),
    };

    return GraphAPI.callMessengerProfileAPI(profilePayload);
  }

  setGetStarted() {
    let getStartedPayload = this.getGetStarted();
    return GraphAPI.callMessengerProfileAPI(getStartedPayload);
  }

  setGreeting() {
    let greetingPayload = this.getGreeting();
    return GraphAPI.callMessengerProfileAPI(greetingPayload);
  }

  setPersistentMenu() {
    let menuPayload = this.getPersistentMenu();
    return GraphAPI.callMessengerProfileAPI(menuPayload);
  }

  setWhitelistedDomains() {
    let domainPayload = this.getWhitelistedDomains();
    return GraphAPI.callMessengerProfileAPI(domainPayload);
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
      text:
        "မင်္ဂလာပါ {{user_full_name}}။\nသတင်းမှန်များကို အချိန်နဲ့တပြေးညီ သိရှိနိုင်အောင် ဆောင်ရွက်ပေးနေပါတယ်။",
    };
  }

  getMenuItems() {
    return {
      locale: "default",
      composer_input_disabled: false,
      call_to_actions: [
        {
          type: "postback",
          title: "အကူအညီ",
          payload: "CARE_HELP",
        },
        {
          type: "postback",
          title: "ဆက်သွယ်ရန်",
          payload: "CARE_AGENT_START",
        },
      ],
    };
  }

  getPageManagers() {
    let page_managers = process.env.PAGE_MANAGERS || "";
    return {
      page_managers: page_managers.split(","),
    };
  }

  getWhitelistedDomains() {
    return {
      whitelisted_domains: [
        APP_URL,
        SHOP_URL,
        "https://api.nweoo.com",
        "https://www.nweoo.com",
        "https://facebook.com",
        "https://m.facebook.com",
        "https://www.facebook.com",
      ],
    };
  }
}
