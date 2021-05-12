import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import DB from "./app/DB";
import verify from "./functions/verify";
import router from "./routes";

config();

const app = express();
const { PORT, DATABASE_URL } = process.env;

DB.init();

app.use(json({ verify }));
app.use(urlencoded({ extended: true }));

app.use(router);

// mongoose
//   .connect(DATABASE_URL, {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("database (mongodb) is connected"));

app.listen(PORT || 3000, () => console.log("server (express) is serving"));
