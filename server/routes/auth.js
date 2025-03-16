import express from "express";
import { register, login, allUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users",allUsers)

export default router;
