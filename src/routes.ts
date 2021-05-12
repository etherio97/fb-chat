import { Router } from "express";
import DB from "./app/DB";
import Response from "./app/Response";
import GraphAPI from "./app/GraphAPI";
import News from "./app/News";
import Profile from "./app/Profile";
import Receive from "./app/Receive";
import User from "./app/User";
import axios from "axios";

const { API_URL, VERIFY_TOKEN } = process.env;
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
  if (body.object !== "page") return res.sendStatus(204);
  body.entry.forEach(function (entry) {
    if ("changes" in entry) {
      if (entry.changes[0].field === "feed") {
        let change = entry.changes[0].value;
        switch (change.item) {
          case "post":
          case "comment":
            axios
              .post(`${API_URL}/fb/webhook`, change)
              .then(() => res.status(204).end())
              .catch(() => res.status(500).end());
            break;
          case "reaction": // ignored
            break;
          default:
            console.log("Unsupported feed change type.", change.item);
        }
      }
      res.status(204).end();
      return;
    }
    res.status(200).send("EVENT_RECEIVED");
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
