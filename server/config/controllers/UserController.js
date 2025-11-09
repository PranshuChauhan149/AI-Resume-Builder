import User from "../../models/User";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRECT, {
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
  } catch (error) {}
};
