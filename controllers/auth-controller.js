import gravatar from "gravatar";
import { HttpError } from "../helpers/HttpError.js";
import User, {
  signinSchema,
  signupSchema,
  userEmailSchema,
} from "../models/User.js";
import jwt from "jsonwebtoken";
import jimp from "jimp";
import "dotenv/config";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const { error } = signupSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const avatarURL = gravatar.url(email, { s: 250, d: "retro" }, false);
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify your email</a>`,
    };
    await sendEmail(verifyEmail);
    res.status(201).json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { error } = signinSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verify");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = (req, res, next) => {
  const { subscription, email } = req.user;

  res.status(200).json({ email, subscription });
};

const signout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!req.file) {
      throw HttpError(400, "Missing avatar photo");
    }
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarsPath, filename);
    const image = await jimp.read(oldPath);
    await image.resize(250, 250);
    await image.writeAsync(newPath);
    const avatarURL = path.join("avatars", filename);
    fs.rm(oldPath);
    const result = await User.findOneAndUpdate({ _id }, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw HttpError(404, "Not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "1",
    });
    res.json({ message: "Verification successful" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { error } = userEmailSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404, "Not found");
    }
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify your email</a>`,
    };
    await sendEmail(verifyEmail);

    res.json({
      message: "Email send successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  signin,
  getCurrent,
  signout,
  updateAvatar,
  verify,
  resendVerification,
};
