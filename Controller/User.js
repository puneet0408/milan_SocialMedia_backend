import { User } from "../Model/User.js";
import asyncerrorHandler from "../utils/asyncerrorHandler.js";

export const fetchUserById = asyncerrorHandler(async (req, res) => {
  const { id } = req.params;

  const users = await User.findById(id, "name email id");
  res.status(200).json(users);
});

export const UpdateUser = asyncerrorHandler(async (req, res) => {
  const { name, Bio, profilePic, gender } = req.body;
  const { id } = req.params;
  let imagename = null;
  if (profilePic) {
    imagename = profilePic;
  } else {
    const existing = await User.findById(id);
    imagename = existing.profilePic;
  }
  const doc = await User.findByIdAndUpdate(
    { _id: id },
    {
      name: name,
      Bio: Bio,
      gender: gender,
      profilePic: imagename,
    },
    {
      new: true,
    }
  );
  res.status(200).json(doc);
});

export const DeleteUser = asyncerrorHandler(async (req, res) => {
  const { id } = req.params;
  const doc = await User.findOneAndDelete({ _id: id });
  res.status(200).json(doc);
});
