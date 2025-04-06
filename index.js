import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./Routes/User.js";
import Router from "./Routes/Auth.js";
import FeedRoutes from "./Routes/Feed.js";
import CustomError from "./utils/customError.js";
import errorHandler from "./Controller/errorHandler.js"

config({ path: "./config/config.env" });

process.on('unCaughtException',(err)=>{
  console.log(err.name , err.message);
  console.log("unCaught Exception occurs shutting down....");
    process.exit(1);

})

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
server.use("/auth", Router);
server.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "'fail",
  //   message: `cant find ${req.originalUrl} on sever!!`,
  // });
  // handle error using  global error handling middleware 
  // const err = new Error(`cant find ${req.originalUrl} on sever!!`)
  // err.status='fail';
  // err.statusCode=404;

// handle error using class consructor 
const err = new CustomError(`can't find  ${req.originalUrl} on the server`,404);
  next(err);
});


 server.use(errorHandler);

server.get("/", (req, res) => {
  res.json({ status: "sucess" });
});
const app = server.listen("8000", () => {
  console.log("server started");
});


process.on('unhandledRejection',(err)=>{
    console.log(err.name , err.message);
    console.log("unhandled Rejection occurs shutting down....");
    app.close(()=>{
      process.exit(1);
    })
})

