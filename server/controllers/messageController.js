import mongoose from "mongoose";
import { sendMessage, getMessages } from "../services/messageService.js";

export const createMessage = async (req, res) => {
  try {
    const { content, room, groupId } = req.body;

    if (!content || (!room && !groupId)) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const message = await sendMessage(req.user, content, room, groupId);

    res.status(201).json(message);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchMessages = async (req, res) => {
  try {
    let { roomOrGroupId } = req.params;

    const isGroup = mongoose.Types.ObjectId.isValid(roomOrGroupId);
    const messages = await getMessages(roomOrGroupId, isGroup);

    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Server error" });
  }
};
