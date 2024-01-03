import { User } from "../Model/User.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

const bcryptSalt = bycrypt.genSaltSync(10);
const jwtSecret =
  "ekdkmskmsdcwedewqeqeriwrijwednwendwjkEFJCN8TOQWERFSDFKNNWvene";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({
    name,
    email,
    password: bycrypt.hashSync(password, bcryptSalt),
  });

  try {
    const doc = await user.save();
    console.log(doc);
    res.json(doc._id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in account creation" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (userDoc) {
      const isauth = bycrypt.compareSync(password, userDoc.password);

      if (isauth) {
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              console.error(err);
              res.status(500).json({ message: "Error creating token" });
            }
            res.json({ token, user: userDoc._id });
          }
        );
      } else {
        res.status(422).json("Invalid credentials");
      }
    } else {
      res.status(400).json("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(401).json("User not found");
  }
};

export const Profile = async (req, res) => {
  const token = req.header('Authorization');

  if (token && token.startsWith("Bearer ")) {
    const tokenValue = token.slice(7);

    jwt.verify(tokenValue, jwtSecret, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
      }

      User.findById(user.id)
        .then(userDoc => {
          if (userDoc) {
            res.json(userDoc);
          } else {
            res.status(404).json("User not found");
          }
        })
        .catch(error => {
          console.error(error);
          res.status(500).json("Internal server error");
        });
    });
  } else {
    res.status(422).json("Can't get token");
  }
};

