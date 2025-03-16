import {
  createGroup,
  joinGroup,
  getUserGroups,
} from "../services/groupService.js";

export const createGroupChat = async (req, res) => {
  try {
    const { name, members } = req.body;
    const group = await createGroup(name, members);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const joinGroupChat = async (req, res) => {
  try {
    const group = await joinGroup(req.params.groupId, req.user);
    res.json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getGroupsForUser = async (req, res) => {
  try {
    const groups = await getUserGroups(req.user);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
