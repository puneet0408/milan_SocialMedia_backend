import {
  createFeed,
  fetchAllFeed,
  fetchAllFeedsByUser,
  fetchFeedById,
  DeleteFeed,
  UpdateFeed,
} from "../Controller/Feed.js";
import { protect } from "../Controller/auth.js";
import express from "express";
const FeedRoutes = express.Router();
FeedRoutes.post("/", createFeed)
  .get("/",fetchAllFeed)
  .get("/userFeed/:id",  fetchAllFeedsByUser)
  .get("/:id", fetchFeedById)
  .delete("/:id", DeleteFeed)
  .patch("/:id", UpdateFeed);
export default FeedRoutes;
