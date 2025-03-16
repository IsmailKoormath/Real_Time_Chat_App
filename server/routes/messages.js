import express from "express";
import {
  fetchMessages,
  createMessage,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:roomOrGroupId", authMiddleware, fetchMessages);
router.post("/", authMiddleware, createMessage);

export default router;
