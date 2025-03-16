import {
  registerUser,
  loginUser,
  getAllUsers,
} from "../services/userService.js";

export const register = async (req, res) => {
  try {
    const response = await registerUser(
      req.body.username,
      req.body.email,
      req.body.password
    );
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const response = await loginUser(req.body.email, req.body.password);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const allUsers = async (req, res) => {
  try {
    const response = await getAllUsers();
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
