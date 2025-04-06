import mongoose from "mongoose";
import { Schema } from "mongoose";

const feedSchema = new Schema({
  about: {
    type: String,
    trim : true   
  },
  feedPost: {
    type: String,
    required: true,
    default: "",
  },
  likeCount: {
    type: [Object],
  },
  Comment: {
    type: [Object],
  },
  userId: {
    type: String,
  },
  userName: {
    type: String,
  },
  userProfile: {
    type: String,
  },
});

export const Feed = mongoose.model("Feed", feedSchema);
