import { Router } from "express";
import DB from "./app/DB";
import Response from "./app/Response";
import GraphAPI from "./app/GraphAPI";
import News from "./app/News";
import Profile from "./app/Profile";
import Receive from "./app/Receive";
import User from "./app/User";

const { APP_ID, PAGE_ID, VERIFY_TOKEN } = process.env;
const router = Router();
const users = {};

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

router.post("/webhook", (req, res) => {
  let body = req.body;
  if (body.object !== "page") return res.sendStatus(404);
  res.status(200).send("EVENT_RECEIVED");
  body.entry.forEach(function (entry) {
    if ("changes" in entry) {
      let receiveMessage = new Receive(null);
      if (entry.changes[0].field === "feed") {
        let change = entry.changes[0].value;
        switch (change.item) {
          case "post":
            //
            return;
          case "comment":
            //
            return;
          default:
            console.log("Unsupported feed change type.", change);
            return;
        }
      }
    }

    let webhookEvent = entry.messaging[0];

    if ("read" in webhookEvent || "delivery" in webhookEvent) {
      return;
    }

    let psid = webhookEvent.sender.id;

    if (!(psid in users)) {
      let user = new User(psid);
      GraphAPI.getUserProfile(psid)
        .then((userProfile) => {
          user.setProfile(userProfile);
        })
        .catch((error) => {
          console.log("Profile is unavailable:", error);
        })
        .finally(() => {
          users[psid] = user;
          let receiveMessage = new Receive(users[psid], webhookEvent);
          return receiveMessage.handleMessage();
        });
    } else {
      let receiveMessage = new Receive(users[psid], webhookEvent);
      return receiveMessage.handleMessage();
    }
  });
});

router.get("/nweoo", (req, res) => {
  if (req.query["verify_token"] !== VERIFY_TOKEN) return res.sendStatus(403);
  const profile = new Profile(null);
  const news = new News(null);
  res.send("EVENT_UPDATED");
  news.fetchAll();
  profile.setThread();
  profile.setWhitelistedDomains();
});

router.post("/greeting", (req, res) => {
  const { text } = req.body;
  res.sendStatus(200);
  new Profile(null).getGreeting(text);
});

function closeInAppBrowser(res) {
  res.redirect(
    `https://www.messenger.com/closeWindow/?image_url=https%3A%2F%2Fstorage.googleapis.com%2Fnwe-oo.appspot.com%2Fpublic%2F2021%2F05%2Fnweoo-bot-avatar.jpg&display_text=closing`
  );
  res.end();
}

export default router;
