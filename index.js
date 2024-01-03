import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./Routes/User.js";
import Router from "./Routes/Auth.js";
import FeedRoutes from "./Routes/Feed.js";

config({ path: "./config/config.env" });
const server = express();
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(`${process.env.MONGO_CLUSTER}`);
  console.log("database Connected");
}
server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(cors());
server.use("/users", UserRouter);
server.use("/feed", FeedRoutes);
server.use("/Auth", Router);
server.get("/", (req, res) => {
  res.json({ status: "sucess" });
});
server.listen("8080", () => {
  console.log("server started");
});
