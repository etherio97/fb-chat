const request = require("request"),
  camelCase = require("camelcase"),
  config = require("./config");

module.exports = class GraphAPi {
  static callSendAPI(requestBody) {
    request(
      {
        uri: `${config.mPlatfom}/me/messages`,
        qs: {
          access_token: config.pageAccesToken,
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
        uri: `${config.mPlatfom}/me/messenger_profile`,
        qs: {
          access_token: config.pageAccesToken,
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
        uri: `${config.mPlatfom}/${config.appId}/subscriptions`,
        qs: {
          access_token: config.appId + "|" + config.appSecret,
          object: "page",
          callback_url: config.webhookUrl,
          verify_token: config.verifyToken,
          fields: fields,
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
        uri: `${config.mPlatfom}/${config.pageId}/subscribed_apps`,
        qs: {
          access_token: config.pageAccesToken,
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

  static callUserProfileAPI(senderPsid) {
    return new Promise(function(resolve, reject) {
      let body = [];
      request({
        uri: `${config.mPlatfom}/${senderPsid}`,
        qs: {
          access_token: config.pageAccesToken,
          fields: "first_name, last_name, gender",
        },
        method: "GET",
      })
        .on("response", function(response) {
          if (response.statusCode !== 200) {
            reject(Error(response.statusCode));
          }
        })
        .on("data", function(chunk) {
          body.push(chunk);
        })
        .on("error", function(error) {
          reject(Error("Network Error"));
        })
        .on("end", () => {
          body = Buffer.concat(body).toString();
          resolve(JSON.parse(body));
        });
    });
  }

  static getPersonaAPI() {
    return new Promise(function(resolve, reject) {
      let body = [];
      request({
        uri: `${config.mPlatfom}/me/personas`,
        qs: {
          access_token: config.pageAccesToken,
        },
        method: "GET",
      })
        .on("response", function(response) {
          if (response.statusCode !== 200) {
            reject(Error(response.statusCode));
          }
        })
        .on("data", function(chunk) {
          body.push(chunk);
        })
        .on("error", function(error) {
          console.error("Unable to fetch personas:" + error);
          reject(Error("Network Error"));
        })
        .on("end", () => {
          body = Buffer.concat(body).toString();
          resolve(JSON.parse(body).data);
        });
    });
  }

  static postPersonaAPI(name, profile_picture_url) {
    let body = [];
    return new Promise(function(resolve, reject) {
      console.log(`Creating a Persona for app ${config.appId}`);
      let requestBody = {
        name: name,
        profile_picture_url: profile_picture_url,
      };
      request({
        uri: `${config.mPlatfom}/me/personas`,
        qs: {
          access_token: config.pageAccesToken,
        },
        method: "POST",
        json: requestBody,
      })
        .on("response", function(response) {
          if (response.statusCode !== 200) {
            reject(Error(response.statusCode));
          }
        })
        .on("data", function(chunk) {
          body.push(chunk);
        })
        .on("error", function(error) {
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
    console.log(`Enable Built-in NLP for Page ${config.pageId}`);
    request(
      {
        uri: `${config.mPlatfom}/me/nlp_configs`,
        qs: {
          access_token: config.pageAccesToken,
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
      page_id: config.pageId,
      page_scoped_user_id: senderPsid,
    };

    // Send the HTTP request to the Activities API
    request(
      {
        uri: `${config.mPlatfom}/${config.appId}/activities`,
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
};
