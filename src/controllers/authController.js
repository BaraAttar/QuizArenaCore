const User = require("../models/User.js");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = Joi.object({
  firstName: Joi.string().max(30).required(),
  lastName: Joi.string().max(30).required(),
  userName: Joi.string().max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?\d{7,15}$/)
    .optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email(),
  userName: Joi.string(),
  password: Joi.string().min(8).required(),
}).or("email", "userName");

exports.logIn = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      let message = error.details[0].message;
      message = message.replace(/\"/g, "");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    const { email, userName, password } = req.body;


    const user = await User.findOne({ $or: [{ email }, { userName }] });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // (3) Craet Token
    const token = jwt.sign(
      { id: user._id,  },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );

    user.lastLogin = new Date();

    await user.save();

    res.status(200).json({ status: "success", token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong during login. Please try again later.",
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, phoneNumber, email, password } =
      req.body;

    // (1) inputs vaildations
    const { error } = userSchema.validate(req.body);
    if (error) {
      let message = error.details[0].message;
      message = message.replace(/\"/g, "");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    // (2) if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or Username already used" });
    }

    // (3) if user not exists craet new user and save
    const user = new User({
      firstName,
      lastName,
      userName,
      phoneNumber,
      email,
      password,
    });
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1y" }
    );

    res.status(200).json({ status: "success", token, user });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong during signup. Please try again later.",
    });
  }
};
