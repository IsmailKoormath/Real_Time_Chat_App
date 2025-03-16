import Group from "../models/Group.js";

export const createGroup = async (name, members) => {
  const existingGroup = await Group.findOne({ name });
  if (existingGroup) throw new Error("Group name already exists");

  const newGroup = new Group({ name, members });
  await newGroup.save();
  return newGroup;
};

export const joinGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) throw new Error("Group not found");

  if (!group.members.includes(userId)) {
    group.members.push(userId);
    await group.save();
  }

  return group;
};

export const getUserGroups = async (userId) => {
  return await Group.find({ members: userId }).populate("members", "username");
};
