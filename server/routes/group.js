import express from "express";
import {
  createGroupChat,
  joinGroupChat,
  getGroupsForUser,
} from "../controllers/groupController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createGroupChat);
router.post("/:groupId/join", authMiddleware, joinGroupChat);
router.get("/", authMiddleware, getGroupsForUser);

export default router;
