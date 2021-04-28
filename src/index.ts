import { config } from "dotenv";
import DB from "./app/DB";
import express, { json, urlencoded } from "express";
import verify from "./functions/verify";
import router from "./routes";

config();

const app = express();
const { PORT } = process.env;

DB.init();

app.use(json({ verify }));
app.use(urlencoded({ extended: true }));

app.use(router);

app.listen(PORT || 3000, () =>
  console.log("server is running on http://localhost:%s", PORT || 3000)
);
