import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    minLength: 5,
    required: true,
  },
  Bio: {
    type: String,
  },
  token: String,
  gender: {
    type: String,
  },
});

export const User = mongoose.model("user", userSchema);
