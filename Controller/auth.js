import { User } from "../Model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncerrorHandler from "../utils/asyncerrorHandler.js";
import CustomError from "../utils/customError.js";
import util from "util";

export const createUser = asyncerrorHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  const doc = await user.save();
  const token = jwt.sign({ id: doc._id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
  console.log(doc);
  res.json({
    status: 200,
    success: true,
    token,
    data: {
      user: doc,
    },
  });
});

export const loginUser = asyncerrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);

  if (!email || !password) {
    const error = new CustomError(
      "plese provide email an password for login user",
      400
    );
    return next(error);
  }

  const userDoc = await User.findOne({email}).select("+password");
  console.log(userDoc,"ghghg");
  if (userDoc) {
    const isauth = bcrypt.compareSync(password, userDoc.password);

    if (isauth) {
      jwt.sign(
        {
          id: userDoc._id,
        },
        process.env.SECRRET_STR,
        { expiresIn: process.env.LOGIN_EXPIRES },
        (err, token) => {
          if (err) {
            console.error("password not match");
            const error = new CustomError(`password not matched`, 404);
            return next(error);
          }
          res.json({ token, user: userDoc });
        }
      );
    } else {
      const error = new CustomError(`Invalid credentials`, 422);
      return next(error);
    }
  } else {
    const error = new CustomError(`user not found`, 400);
    return next(error);
  }
});



export const Profile = asyncerrorHandler(async (req, res) => {
  const userId = req.params.id;
  console.log(userId , "dsf");
  try {
    const userDoc = await User.findById(userId);
    if (userDoc) {
      res.json(userDoc);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

 

export const protect = asyncerrorHandler(async (req, res, next) => {
  // read token and check it exist or not
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.toLowerCase().startsWith("bearer")) {
    token = testToken.split(" ")[1];
  }
  console.log(token,"auth");
  if (!token) {
    console.log("You are not logged in");
    return next(new CustomError("You are not logged in!", 401));
  }
  
  // validate it
  // util used for creating non-promise function into promise
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRRET_STR
  );

  // check if user exists in db or not
  const user = await User.findById(decodedToken.id);

  console.log(user , "ayth");

  if (!user) {
    return next(new CustomError("User with token does not exist", 404));
  }

  // check if the user changed password after the token was issued
  // if (User.passwordChangedAt(decodedToken.iat)) {
  //   const error = new CustomError(
  //     "Password changed recently, please login again",
  //     401
  //   );
  //   return next(error);
  // }

  req.user = user;
  next();
});
