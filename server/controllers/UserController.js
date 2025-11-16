import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Resume from "../models/Resume.js";
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required Feilds" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });
    const token = generateToken(newUser._id);
    newUser.password = undefined;
    return res
      .status(201)
      .json({ message: "User created successflly", token, user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    user.password = undefined;
    return res.status(200).json({ message: "Login  successflly", token, user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.password = undefined;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserResume = async (req, res) => {
  try {
    const userId = req.userId;
    const resume = await Resume.findById({ userId });
    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
