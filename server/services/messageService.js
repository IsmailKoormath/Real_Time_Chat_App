import Message from "../models/Message.js";

export const sendMessage = async (userId, content, room, groupId) => {
  if (!userId || !content || (!room && !groupId)) {
    throw new Error("Missing required fields");
  }

  const message = new Message({
    sender: userId,
    content,
    room,
    group: groupId,
  });

  const savedMessage = await message.save();

  return savedMessage;
};

export const getMessages = async (roomOrGroupId, isGroup) => {

  const filter = isGroup
    ? { group: roomOrGroupId } 
    : { room: roomOrGroupId };

  return await Message.find(filter)
    .populate("sender", "username")
    .sort({ createdAt: 1 });
};
