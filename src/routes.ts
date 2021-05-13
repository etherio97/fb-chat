import { Router } from "express";
import DB from "./app/DB";
import Response from "./app/Response";
import GraphAPI from "./app/GraphAPI";
import News from "./app/News";
import Message from "./app/Message";
import User from "./app/User";
import Feed from "./app/Feed";

interface UserObject {
  [psid: string]: User;
}

const { VERIFY_TOKEN } = process.env;
const users: UserObject = {};
const router = Router();

setTimeout(() => new News(null).fetchAll(), 3000);

router.get("/", (req, res) => res.send("STATUS_OK"));

router.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  if (!(mode && token)) {
    return res.sendStatus(400);
  }
  if (!(mode === "subscribe" && token === VERIFY_TOKEN)) {
    return res.sendStatus(403);
  }
  res.status(200).send(challenge);
});

router.post(
  "/webhook",
  (req, res) =>
    (req.body.object === "page" &&
      req.body["entry"].forEach(function (entry) {
        if ("changes" in entry) {
          res.sendStatus(200);
          let { field, value } = entry.changes[0];
          let { from } = value;
          let user = new User(from.id);
          if ("name" in from) user.setProfile({ name: from.name });
          if (field === "feed") {
            new Feed(value);
          } else if ("videos" in field) {
            //
          } else {
            console.log("Unsupported changed event:", field);
          }
        } else if ("messages" in entry) {
          res.sendStatus(200);
          let webhookEvent: object = entry.messages[0];
          let psid: string = webhookEvent["sender"]["id"];
          if ("read" in webhookEvent || "delivery" in webhookEvent) return;
          if (!(psid in users)) {
            users[psid] = new User(psid);
            GraphAPI.getUserProfile(psid)
              .then((userProfile) => {
                users[psid].setProfile(userProfile);
              })
              .catch((e) => null)
              .finally(() => {
                new Message(users[psid], webhookEvent).handle();
              });
          } else {
            new Message(users[psid], webhookEvent).handle();
          }
        } else {
          console.log("Unsuported event field:", ...Object.keys(entry));
        }
      })) ||
    res.status(204).end()
);

export default router;
