/**
 * Copyright 2019-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Messenger For Original Coast Clothing
 * https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing
 */

"use strict";

const Response = require("./response"),
  config = require("./config"),
  i18n = require("../i18n.config");

module.exports = class News {
  constructor(user, webhookEvent) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handlePayload(payload) {
    let response;

    switch (payload) {
      case "NEWS_GETTING":
        response = [
          Response.genQuickReply(i18n.__('news.channels', [
            {
              title: 'SMS',
              payload: 'NEWS_GETTING_SMS'
            },
            {
              title: 'Messenger',
              payload: 'NEWS_GETTING_MESSENGER'
            }
          ]))
        ];
        break;

      case "NEWS_REPORTING":
        response = [
           Response.genQuickReply(i18n.__('news.channels'), [
            {
              title: 'SMS',
              payload: 'NEWS_REPORTING_SMS'
            },
            {
              title: 'Messenger',
              payload: 'NEWS_REPORTING_MESSENGER'
            }
           ])
        ];
        break;

        case "NEWS_GETTING_SMS":
          response = [
            Response.genText(i18n.__('news.getting_sms'))
          ];
          break;

        case "NEWS_GETTING_MESSENGER":
          response = [
            Response.genText(i18n.__('news.getting_messenger'))
          ];
          break;

        case "NEWS_REPORTING_SMS":
          response = [
            Response.genText(i18n.__('news.reporting_sms'))
          ];
          break;

        case "NEWS_REPORTING_MESSENGER":
          response = [
            Response.genText(i18n.__('news.reporting_messenger'))
          ];
          break;
    }

    return response;
  }
};
