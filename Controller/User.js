import { User } from "../Model/User.js";

export const fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.findById(id, "name email id");
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json(err);
  }
};

export const UpdateUser = async (req, res) => {
  const { name, Bio, profilePic, gender } = req.body;
  const { id } = req.params;
  try {
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
  } catch (error) {
    res.status(400).json(err);
  }
};

export const DeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const doc = await User.findOneAndDelete({ _id: id });
      res.status(200).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };
