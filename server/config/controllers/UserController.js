import User from "../../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    const {  email, password } = req.body;
 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid" });
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

