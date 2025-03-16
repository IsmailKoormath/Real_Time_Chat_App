import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

const token_secret = process.env.JWT_SECRET;

export const registerUser = async (username, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  return { message: "User registered successfully" };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, token_secret, {
    expiresIn: "1h",
  });

  return {
    token,
    user: { id: user._id, username: user.username, email: user.email },
  };
};

export const getAllUsers = async () => {
  const users = await User.find();
  return { users };
};

