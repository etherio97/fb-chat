import request from "request";
import camelCase from "camelcase";

const {
  APP_ID,
  APP_SECRET,
  APP_URL,
  PAGE_ID,
  PAGE_ACCESS_TOKEN,
  VERIFY_TOKEN,
} = process.env;

export default class GraphAPI {
  static callSendAPI(requestBody) {
    request(
      {
        uri: "https://graph.facebook.com/v10.0/me/messages",
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
        },
        method: "POST",
        json: requestBody,
      },
      (error) => {
        if (error) {
          console.error("Unable to send message:", error);
        }
      }
    );
  }

  static callMessengerProfileAPI(requestBody) {
    request(
      {
        uri: "https://graph.facebook.com/v10.0/me/messenger_profile",
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
        },
        method: "POST",
        json: requestBody,
      },
      (error, _res, body) => {
        if (!error) {
          console.log("Request sent:", body);
        } else {
          console.error("Unable to send message:", error);
        }
      }
    );
  }

  static callSubscriptionsAPI(customFields) {
    let fields =
      "messages, messaging_postbacks, messaging_optins, \
        message_deliveries, messaging_referrals";

    if (customFields !== undefined) {
      fields = fields + ", " + customFields;
    }

    request(
      {
        uri: `https://graph.facebook.com/v10.0/${APP_ID}/subscriptions`,
        qs: {
          access_token: APP_ID + "|" + APP_SECRET,
          object: "page",
          callback_url: `${APP_URL}/webhook`,
          verify_token: VERIFY_TOKEN,
          fields,
          include_values: "true",
        },
        method: "POST",
      },
      (error, _res, body) => {
        if (!error) {
          console.log("Request sent:", body);
        } else {
          console.error("Unable to send message:", error);
        }
      }
    );
  }

  static callSubscribedApps(customFields) {
    let fields =
      "messages, messaging_postbacks, messaging_optins, \
        message_deliveries, messaging_referrals";

    if (customFields !== undefined) {
      fields = fields + ", " + customFields;
    }

    console.log(fields);

    request(
      {
        uri: `https://graph.facebook.com/v10.0/${PAGE_ID}/subscribed_apps`,
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
          subscribed_fields: fields,
        },
        method: "POST",
      },
      (error) => {
        if (error) {
          console.error("Unable to send message:", error);
        }
      }
    );
  }

  static async getUserProfile(senderPsid) {
    try {
      const userProfile = await this.callUserProfileAPI(senderPsid);

      for (const key in userProfile) {
        const camelizedKey = camelCase(key);
        const value = userProfile[key];
        delete userProfile[key];
        userProfile[camelizedKey] = value;
      }

      return userProfile;
    } catch (err) {
      console.log("Fetch failed:", err);
    }
  }

  static callUserProfileAPI(psid): Promise<any[]> {
    return new Promise(function (resolve, reject) {
      let body: any = [];
      request({
        uri: `https://graph.facebook.com/v10.0/${psid}`,
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: "first_name, last_name, gender",
        },
        method: "GET",
      })
        .on("response", function (response) {
          if (response.statusCode !== 200) {
            reject(Error(response.statusCode));
          }
        })
        .on("data", function (chunk) {
          body.push(chunk);
        })
        .on("error", function (error) {
          reject(Error("Network Error"));
        })
        .on("end", () => {
          body = Buffer.concat(body).toString();
          resolve(JSON.parse(body));
        });
    });
  }

  static getPersonaAPI(): Promise<any[]> {
    return new Promise(function (resolve, reject) {
      let body: any = [];
      request({
        uri: "https://graph.facebook.com/v10.0/me/personas",
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
        },
        method: "GET",
      })
        .on("response", function (response) {
          if (response.statusCode !== 200) {
            reject(Error(response.statusCode));
          }
        })
        .on("data", function (chunk) {
          body.push(chunk);
        })
        .on("error", function (error) {
          console.error("Unable to fetch personas:" + error);
          reject(Error("Network Error"));
        })
        .on("end", () => {
          body = Buffer.concat(body).toString();
          resolve(JSON.parse(body).data);
        });
    });
  }

  static postPersonaAPI(
    name: string,
    profile_picture_url: string
  ): Promise<any> {
    let body: any = [];
    return new Promise(function (resolve, reject) {
      let requestBody = { name, profile_picture_url };
      request({
        uri: "https://graph.facebook.com/v10.0/me/personas",
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
        },
        method: "POST",
        json: requestBody,
      })
        .on("response", function (response) {
          if (response.statusCode !== 200) {
            reject(Error(response.statusCode));
          }
        })
        .on("data", function (chunk) {
          body.push(chunk);
        })
        .on("error", function (error) {
          console.error("Unable to create a persona:", error);
          reject(Error("Network Error"));
        })
        .on("end", () => {
          body = Buffer.concat(body).toString();
          resolve(JSON.parse(body).id);
        });
    }).catch((error) => {
      console.error("Unable to create a persona:", error, body);
    });
  }

  static callNLPConfigsAPI() {
    request(
      {
        uri: "https://graph.facebook.com/v10.0/me/nlp_configs",
        qs: {
          access_token: PAGE_ACCESS_TOKEN,
          nlp_enabled: true,
        },
        method: "POST",
      },
      (error, _res, body) => {
        if (!error) {
          console.log("Request sent:", body);
        } else {
          console.error("Unable to activate built-in NLP:", error);
        }
      }
    );
  }

  static callFBAEventsAPI(senderPsid, eventName) {
    let requestBody = {
      event: "CUSTOM_APP_EVENTS",
      custom_events: JSON.stringify([
        {
          _eventName: "postback_payload",
          _value: eventName,
          _origin: "original_coast_clothing",
        },
      ]),
      advertiser_tracking_enabled: 1,
      application_tracking_enabled: 1,
      extinfo: JSON.stringify(["mb1"]),
      page_id: PAGE_ID,
      page_scoped_user_id: senderPsid,
    };

    // Send the HTTP request to the Activities API
    request(
      {
        uri: `https://graph.facebook.com/v10.0/${APP_ID}/activities`,
        method: "POST",
        form: requestBody,
      },
      (error) => {
        if (!error) {
          console.log(`FBA event '${eventName}'`);
        } else {
          console.error(`Unable to send FBA event '${eventName}':` + error);
        }
      }
    );
  }
}
